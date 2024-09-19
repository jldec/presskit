---
title: Getting started with Goroutines and channels
splash:
  image: images/grape-hyacinth.jpg
date: 2021-04-25
excerpt: Part 3 in my learning Go series, focusing on concurrency with Goroutines and channels.
---

# Getting started with Goroutines and channels

This is part 3 of my experience as a new user of Go, focusing on concurrency with Goroutines and channels.

For installation, testing, and packages, see [Getting started with Go](getting-started-with-go), and for pointers see [Getting started with Go pointers](getting-started-with-go-part-2-pointers).

## Counting HTTP requests

The [server](https://github.com/jldec/racey-go/blob/main/main.go) below counts HTTP requests, and returns the latest count on each request. 

_To follow along, clone https://github.com/jldec/racey-go, and start the server with 'go run .'_

```go
package main

import (
	"fmt"
	"net/http"
)

func main() {
	var count uint64 = 0

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		count++
		fmt.Fprintln(w, count)
	})

	fmt.Println("Go listening on port 3000")
	http.ListenAndServe(":3000", nil)
}
```

```sh
$ curl localhost:3000
1
$ curl localhost:3000
2
```

Let's try sending multiple requests at the same time. This command invokes curl with urls from a file using xargs to spawn 4 processes at once.

```sh
$ cat urls.txt | xargs -P 4 -n 1 curl
```

The [file](https://github.com/jldec/racey-go/blob/main/urls.txt) contains 100 lines, but instead of ending on a nice round number, on systems with more than 1 core you may see  something like this (e.g. after 3 runs)

```
289
292
291
```

Replace the Go server with '[node server.js](https://github.com/jldec/racey-go/blob/main/server.js)' to compare the results (e.g. after 3 runs again)

```
298
299
300
```

Now repeat the experiment with the [race detector](https://golang.org/doc/articles/race_detector) turned on. The detector will report a problem on [line 12](https://github.com/jldec/racey-go/blob/main/main.go#L12) of main.go which is `count++`.

```sh
$ go run -race .
Go listening on port 3000
==================
WARNING: DATA RACE
Read at 0x00c000138280 by goroutine 7:
  main.main.func1()
      /Users/jleschner/pub/racey-go/main.go:12 +0x4a
  net/http.HandlerFunc.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2069 +0x51
  net/http.(*ServeMux).ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2448 +0xaf
  net/http.serverHandler.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2887 +0xca
  net/http.(*conn).serve()
      /Users/jleschner/go1.16.3/src/net/http/server.go:1952 +0x87d

Previous write at 0x00c000138280 by goroutine 9:
  main.main.func1()
      /Users/jleschner/pub/racey-go/main.go:12 +0x64
  net/http.HandlerFunc.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2069 +0x51
  net/http.(*ServeMux).ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2448 +0xaf
  net/http.serverHandler.ServeHTTP()
      /Users/jleschner/go1.16.3/src/net/http/server.go:2887 +0xca
  net/http.(*conn).serve()
      /Users/jleschner/go1.16.3/src/net/http/server.go:1952 +0x87d
```

## Data races

From the [race detector](https://golang.org/doc/articles/race_detector) docs:

_A data race occurs when two goroutines access the same variable concurrently and at least one of the accesses is a write._

> It's clear that 'count++' modifies the count, but what are goroutines and where are they in this case?

## Goroutines

Goroutines provide low-overhead threading. They are easy to create and scale well on multi-core processors.

The Go runtime can schedule many concurrent goroutines across a small number of OS threads. Under the covers, this is how the [http](https://golang.org/src/net/http/server.go#L3013) library handles concurrent web requests.

Let's start with an example. You can run it in the [Go Playground](https://play.golang.org/p/HdH4UQEEXuU).

```go
package main

import (
	"fmt"
	"time"
)

func main() {
	ch := make(chan string)

	// start 2 countdowns in parallel goroutines
	go countdown("crew-1", ch)
	go countdown("crew-2", ch)

	fmt.Println(<-ch) // block waiting to receive 1st string
	fmt.Println(<-ch) // block waiting to receive 2nd string
}

func countdown(name string, ch chan<- string) {
	for i := 10; i > 0; i-- {
		fmt.Println(name, i)
		time.Sleep(1 * time.Second)
	}
	ch <- "blastoff " + name
}
```

Each 'go countdown()' starts a new [goroutine](https://tour.golang.org/concurrency/1). Notice how the countdowns are interleaved in the output.

```
...
crew-1 3
crew-2 3
crew-2 2
crew-1 2
crew-1 1
crew-2 1
blastoff crew-2
blastoff crew-1
```

## Channels

[Channels](https://tour.golang.org/concurrency/2) allow goroutines to communicate and coordinate.

In the example above, `<-ch` (receive) will block until another goroutine uses `ch <-` to send a string to the channel. This happens at the end of each countdown.

Sends will also block if there are no receivers, but that is not the case here.

There are many other variations for how to use channels, including [buffered channels](https://tour.golang.org/concurrency/3) which only block sends when the buffer is full.

## Atomicity

Given that [net/http](https://pkg.go.dev/net/http) requests are handled by goroutines, can we explain why there is a data race when the function which handles a request increments a shared counter?

The reason is that `count++` requires a read followed by write, and these are not automatically synchronized. One goroutine may overwrite the increment of another, resulting in lost writes.

To fix this, the counter has be protected to make the increment operation atomic.

## Counter-go

[github.com/jldec/counter-go](https://github.com/jldec/counter-go) demonstrates 3 different implementations of a threadsafe global counter.

1. **CounterAtomic** uses `atomic.AddUint64` and `atomic.LoadUint64`.
2. **CounterMutex** uses `sync.RWMutex`.
3. **CounterChannel** serializes all reads and writes inside 1 goroutine with 2 channels.

All 3 types implement a Counter interface:

```go
type Counter interface {
    Get() uint32 // get current counter value
    Inc()        // increment by 1
}
```

The [modified server](https://github.com/jldec/racey-go/blob/fix-with-counter-go/main.go) will work with any of the 3 implementations, and no data race should be detected.

```go
package main

import (
	"fmt"
	"net/http"

	counter "github.com/jldec/counter-go"
)

func main() {
	count := new(counter.CounterAtomic)
	// count := new(counter.CounterMutex)
	// count := counter.NewCounterChannel()

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		count.Inc()
		fmt.Fprintln(w, count.Get())
	})

	fmt.Println("Go listening on port 3000")
	http.ListenAndServe(":3000", nil)
}
```

### Coordination with channels

Of the 3 implementations, [CounterChannel](https://github.com/jldec/counter-go/blob/main/counter_channel.go) is the most interesting. All access to the counter goes through 1 goroutine which uses a [select](https://tour.golang.org/concurrency/5) to wait for either a read or a write on one of two channels.

Can you tell why neither `Inc()` nor `Get()` should block?

```go

package counter

// Thread-safe counter
// Uses 2 Channels to coordinate reads and writes.
// Must be initialized with NewCounterChannel().
type CounterChannel struct {
	readCh  chan uint64
	writeCh chan int
}

// NewCounterChannel() is required to initialize a Counter.
func NewCounterChannel() *CounterChannel {
	c := &CounterChannel{
		readCh:  make(chan uint64),
		writeCh: make(chan int),
	}

	// The actual counter value lives inside this goroutine.
	// It can only be accessed for R/W via one of the channels.
	go func() {
		var count uint64 = 0
		for {
			select {
			// Reading from readCh is equivalent to reading count.
			case c.readCh <- count:
			// Writing to the writeCh increments count.
			case <-c.writeCh:
				count++
			}
		}
	}()

	return c
}

// Increment counter by pushing an arbitrary int to the write channel.
func (c *CounterChannel) Inc() {
	c.check()
	c.writeCh <- 1
}

// Get current counter value from the read channel.
func (c *CounterChannel) Get() uint64 {
	c.check()
	return <-c.readCh
}

func (c *CounterChannel) check() {
	if c.readCh == nil {
		panic("Uninitialized Counter, requires NewCounterChannel()")
	}
}
```

### Benchmarks

All 3 [implementations](https://github.com/jldec/counter-go) are fast. Serializing everything through a goroutine with channels, costs only a few hundred ns for a single read or write. When constrained to a single OS thread, the cost of goroutines is even lower.

```sh
$ go test -bench .
goos: darwin
goarch: amd64
pkg: github.com/jldec/counter-go
cpu: Intel(R) Core(TM) i7-9750H CPU @ 2.60GHz
```

#### Simple: 1 op = 1 Inc() in same thread
```sh
BenchmarkCounter_1/Atomic-12                 195965660          6 ns/op
BenchmarkCounter_1/Mutex-12                   54177086         22 ns/op
BenchmarkCounter_1/Channel-12                  4499144        286 ns/op
```

#### Concurrent: 1 op = 1 Inc() across each of 10 goroutines
```sh
BenchmarkCounter_2/Atomic_no_reads-12          7298484        191 ns/op
BenchmarkCounter_2/Mutex_no_reads-12           1966656        621 ns/op
BenchmarkCounter_2/Channel_no_reads-12          256842       4771 ns/op
```

#### Concurrent: 1 op = [ 1 Inc() + 10 Get() ] across each of 10 goroutines
```sh
BenchmarkCounter_2/Atomic_10_reads-12          3922029        286 ns/op
BenchmarkCounter_2/Mutex_10_reads-12            416354       2844 ns/op
BenchmarkCounter_2/Channel_10_reads-12           21506      55733 ns/op
```

#### Constrained to single thread
```sh
$ GOMAXPROCS=1 go test -bench .

BenchmarkCounter_1/Atomic                    197135869          6 ns/op
BenchmarkCounter_1/Mutex                      55698454         22 ns/op
BenchmarkCounter_1/Channel                     5689788        214 ns/op

BenchmarkCounter_2/Atomic_no_reads            19519166         60 ns/op
BenchmarkCounter_2/Mutex_no_reads              4702759        254 ns/op
BenchmarkCounter_2/Channel_no_reads             530554       2197 ns/op

BenchmarkCounter_2/Atomic_10_reads             6269979        189 ns/op
BenchmarkCounter_2/Mutex_10_reads               927439       1354 ns/op
BenchmarkCounter_2/Channel_10_reads              47889      25054 ns/op
```


> 🚀 - code safe - 🚀

_To leave a comment  
please visit [dev.to/jldec](https://dev.to/jldec/getting-started-with-goroutines-and-channels-fc6)_
