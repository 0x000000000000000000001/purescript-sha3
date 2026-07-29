module TestHash where
import Prelude
import Wasm.Array as WA

hashBytes :: Int -> Int -> Array Int -> Array Int
hashBytes rate outLen input =
  WA.unsafeSet (WA.unsafeNew outLen) padLen 0
  where
  len = WA.length input
  padLen = (len / rate + 1) * rate
