// script.js
const arrayContainer = document.getElementById("array-container");
let array = [];
let comparisonCount = 0;
let swapCount = 0;
let startTime;

function updateStats() {
  document.getElementById("comparison-count").textContent = comparisonCount;
  document.getElementById("swap-count").textContent = swapCount;
}

function generateArray(size = 30) {
  array = [];
  arrayContainer.innerHTML = "";
  for (let i = 0; i < size; i++) {
    const val = Math.floor(Math.random() * 80) + 20;
    array.push(val);
    const bar = document.createElement("div");
    bar.classList.add("array-bar");
    bar.style.height = `${val}%`;
    arrayContainer.appendChild(bar);
  }
  comparisonCount = 0;
  swapCount = 0;
  updateStats();
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function swap(i, j) {
  const bars = document.querySelectorAll(".array-bar");
  [array[i], array[j]] = [array[j], array[i]];
  bars[i].style.height = `${array[i]}%`;
  bars[j].style.height = `${array[j]}%`;
  swapCount++;
  updateStats();
  await sleep(50);
}

async function bubbleSort() {
  const bars = document.querySelectorAll(".array-bar");
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      comparisonCount++;
      updateStats();
      if (array[j] > array[j + 1]) {
        await swap(j, j + 1);
      }
    }
  }
}

async function selectionSort() {
  for (let i = 0; i < array.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < array.length; j++) {
      comparisonCount++;
      updateStats();
      if (array[j] < array[minIdx]) {
        minIdx = j;
      }
    }
    if (minIdx !== i) await swap(i, minIdx);
  }
}

async function insertionSort() {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      comparisonCount++;
      array[j + 1] = array[j];
      j--;
    }
    array[j + 1] = key;
    renderArray();
    await sleep(100);
    updateStats();
  }
}

async function mergeSortWrapper() {
  await mergeSort(0, array.length - 1);
}

async function mergeSort(start, end) {
  if (start >= end) return;
  const mid = Math.floor((start + end) / 2);
  await mergeSort(start, mid);
  await mergeSort(mid + 1, end);
  await merge(start, mid, end);
}

async function merge(start, mid, end) {
  const left = array.slice(start, mid + 1);
  const right = array.slice(mid + 1, end + 1);
  let i = 0,
    j = 0,
    k = start;
  while (i < left.length && j < right.length) {
    comparisonCount++;
    if (left[i] <= right[j]) {
      array[k++] = left[i++];
    } else {
      array[k++] = right[j++];
    }
    renderArray();
    await sleep(50);
    updateStats();
  }
  while (i < left.length) array[k++] = left[i++];
  while (j < right.length) array[k++] = right[j++];
  renderArray();
}

async function quickSortWrapper() {
  await quickSort(0, array.length - 1);
}

async function quickSort(low, high) {
  if (low < high) {
    let pi = await partition(low, high);
    await quickSort(low, pi - 1);
    await quickSort(pi + 1, high);
  }
}

async function partition(low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    comparisonCount++;
    if (array[j] < pivot) {
      i++;
      await swap(i, j);
    }
  }
  await swap(i + 1, high);
  updateStats();
  return i + 1;
}

async function heapSort() {
  const n = array.length;
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) await heapify(n, i);
  for (let i = n - 1; i > 0; i--) {
    await swap(0, i);
    await heapify(i, 0);
  }
}

async function heapify(n, i) {
  let largest = i;
  const l = 2 * i + 1;
  const r = 2 * i + 2;

  if (l < n && array[l] > array[largest]) largest = l;
  if (r < n && array[r] > array[largest]) largest = r;

  comparisonCount += 2;
  updateStats();

  if (largest !== i) {
    await swap(i, largest);
    await heapify(n, largest);
  }
}

function renderArray() {
  const bars = document.querySelectorAll(".array-bar");
  bars.forEach((bar, i) => {
    bar.style.height = `${array[i]}%`;
  });
}

function startSort() {
  const algo = document.getElementById("algorithm").value;
  comparisonCount = 0;
  swapCount = 0;
  startTime = performance.now();
  updateStats();
  document.getElementById("time").textContent = "0";

  let sortPromise;
  switch (algo) {
    case "bubble":
      sortPromise = bubbleSort();
      break;
    case "selection":
      sortPromise = selectionSort();
      break;
    case "insertion":
      sortPromise = insertionSort();
      break;
    case "merge":
      sortPromise = mergeSortWrapper();
      break;
    case "quick":
      sortPromise = quickSortWrapper();
      break;
    case "heap":
      sortPromise = heapSort();
      break;
  }

  sortPromise.then(() => {
    const endTime = performance.now();
    document.getElementById("time").textContent = Math.round(
      endTime - startTime
    );
  });
}

generateArray();
