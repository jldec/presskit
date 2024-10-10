// nanosecond resolution timer
function hrtimer() {
  let start = process.hrtime.bigint()
  return () => Number(process.hrtime.bigint() - start)
}

function benchmarkArrayVsObject(size) {
  const array = new Array(size).fill(0).map((_, i) => i)
  const object = Object.fromEntries(array.map((i) => ['_' + i + '_' + i, i]))
  const map = new Map(array.map((i) => [i, i]))

  const iterations = 100000

  console.log(`Benchmarking with size: ${size}`)

  const warmup = 100 * iterations
  let timer = hrtimer()
  for (let i = 0; i < warmup; i++) {
    const index = Math.floor(Math.random() * size)
    if (index > size) {
      console.log(`Bug, index [${index}] is bigger than size ${size}`)
    }
  }
  const timeBase1 = (timer() / warmup).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < warmup; i++) {
    const index = Math.floor(Math.random() * size)
    const objectKey = '_' + index + '_' + index
    if (objectKey.length < 4) {
      console.log(`Bug, object key [${objectKey}] is shorter than 4`)
    }
  }
  const timeBase2 = (timer() / warmup).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < iterations; i++) {
    const index = Math.floor(Math.random() * size)
    const indexof = array.indexOf(index)
    if (indexof !== index) {
      console.log(`Bug, array.indexOf({index}) is ${indexof}`)
    }
  }
  const timeArrayIndexOf = (timer() / iterations).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < iterations; i++) {
    const index = Math.floor(Math.random() * size)
    const includes = array.includes(index)
    if (!includes) {
      console.log(`Bug, array.includes(${index}) is false`)
    }
  }
  const timeArrayIncludes = (timer() / iterations).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < iterations; i++) {
    const index = Math.floor(Math.random() * size)
    const value = object['_' + index + '_' + index]
    if (value !== index) {
      console.log(`Bug, value of object[${'_' + index + '_' + index}] is ${value}`)
    }
  }
  const timeObject = (timer() / iterations).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < iterations; i++) {
    const index = Math.floor(Math.random() * size)
    const value = map.get(index)
    if (value !== index) {
      console.log(`Bug, value of map.get(${index}) is ${value}`)
    }
  }
  const timeMap = (timer() / iterations).toFixed(1)

  timer = hrtimer()
  for (let i = 0; i < iterations; i++) {
    const index = Math.floor(Math.random() * size)
    const has = map.has(index)
    if (!has) {
      console.log(`Bug, map.has(${index}) is false`)
    }
  }
  const timeMapHas = (timer() / iterations).toFixed(1)

  console.log(`Base time Array:     ${timeBase} ns/iteration`)
  console.log(`Base time Object:    ${timeBase2} ns/iteration`)
  console.log(`Array indexOf time:  ${timeArrayIndexOf} ns/iteration`)
  console.log(`Array includes time: ${timeArrayIncludes} ns/iteration`)
  console.log(`Object lookup time:  ${timeObject} ns/iteration`)
  console.log(`Map lookup time:     ${timeMap} ns/iteration`)
  console.log(`Map has time:        ${timeMapHas} ns/iteration`)
  console.log('------------------------')
}

const sizes = [10, 100, 1000, 10000, 100000]
sizes.forEach(benchmarkArrayVsObject)
