> [!WARNING]
> This must never merge to main branch.

## Matériels

(augustin machine)

- node v23.6.0 (npm v10.9.2)
- Platform: darwin arm64
- CPU Cores: 8 vCPUs | 16.0GB Mem

## Result

## before change:

```txt
--loader                                      | ██████████-------------------- | 10.55 ops/sec
--import (register)                           | ██████████████████████████████ | 30.32 ops/sec
```

## after change:

```txt
--loader                                      | ██████████-------------------- | 10.6 ops/sec
--import (register)                           | ██████████████████████████████ | 30.51 ops/sec
```
