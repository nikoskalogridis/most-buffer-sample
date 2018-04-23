Buffer sample most function

[![Build Status](https://travis-ci.org/nikoskalogridis/most-buffer-sample.svg?branch=master)](https://travis-ci.org/nikoskalogridis/most-buffer-sample)
[![Known Vulnerabilities](https://snyk.io/test/github/nikoskalogridis/most-buffer-sample/badge.svg?targetFile=package.json)](https://snyk.io/test/github/nikoskalogridis/most-buffer-sample?targetFile=package.json)

```
Case 1: Sampler finishes before source stream
source:  ---1--2--3--4--5--6--7--8->
sampler: -x------x--------x--x--|
result:  --------a--------b--c--d|
  a = [1,2]
  b = [3,4,5]
  c = [6]
  d = [7]

Case 2: Sampler finishes after source stream
source:  ---1--2--3--4--5--6--7--8-|
sampler: -x------x--------x-x---------x->
result:  --------a--------b-c------d|
  a = [1,2]
  b = [3,4,5]
  c = [6]
  d = [7,8]
```
