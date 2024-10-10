function hrtimer() {
  let start = process.hrtime.bigint();
  return () => Number(process.hrtime.bigint() - start);
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function createLogScaleHistogram(times) {
  const buckets = {};
  const minLog = Math.floor(Math.log2(Math.min(...times)));
  const maxLog = Math.ceil(Math.log2(Math.max(...times)));

  for (let i = minLog; i <= maxLog; i++) {
    buckets[i] = 0;
  }

  times.forEach(time => {
    const bucket = Math.floor(Math.log2(time));
    buckets[bucket]++;
  });

  const maxCount = Math.max(...Object.values(buckets));
  const histogramWidth = 20;

  return Object.entries(buckets)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([exp, count]) => {
      const bar = '#'.repeat(Math.round((count / maxCount) * histogramWidth));
      const lowerBound = Math.pow(2, Number(exp)).toFixed(0);
      const upperBound = Math.pow(2, Number(exp) + 1).toFixed(0);
      return `${lowerBound.padStart(5)}-${upperBound.padStart(5)}: ${bar.padEnd(histogramWidth)} ${count}`;
    }).join('\n');
}

function runBenchmark(keySize, collectionSize, iterations) {
  const keys = Array.from({ length: collectionSize }, () => generateRandomString(keySize));
  const randomKeys = Array.from({ length: iterations }, () => keys[Math.floor(Math.random() * keys.length)]);

  const map = new Map(keys.map(key => [key, key]));
  const object = Object.fromEntries(keys.map(key => [key, key]));
  const array = keys;

  function benchmarkOperation(operation, name) {
    const times = [];
    for (let i = 0; i < iterations; i++) {
      const timer = hrtimer();
      operation(randomKeys[i]);
      times.push(timer());
    }
    const totalTime = times.reduce((sum, time) => sum + time, 0);
    const meanTime = totalTime / iterations;
    const nsPerOp = meanTime.toFixed(1);
    const histogram = createLogScaleHistogram(times);
    console.log(`${name} (${keySize} chars, ${collectionSize} items): ${nsPerOp} ns/op`);
    console.log(histogram);
    console.log();
    return parseFloat(nsPerOp);
  }

  const mapTime = benchmarkOperation(key => map.get(key), 'Map.get');
  const objectTime = benchmarkOperation(key => object[key], 'Object[key]');
  const arrayTime = benchmarkOperation(key => array.indexOf(key), 'Array.indexOf');

  const fastest = Math.min(mapTime, objectTime, arrayTime);
  console.log(`Fastest: ${fastest === mapTime ? 'Map.get' : fastest === objectTime ? 'Object[key]' : 'Array.indexOf'}`);
  console.log('---');
}

const keySizes = [50];
const collectionSizes = [10, 100, 1000, 10000];
const iterations = 5000;

keySizes.forEach(keySize => {
  collectionSizes.forEach(collectionSize => {
    console.log(`\nBenchmark for key size: ${keySize}, collection size: ${collectionSize}`);
    runBenchmark(keySize, collectionSize, iterations);
  });
});
