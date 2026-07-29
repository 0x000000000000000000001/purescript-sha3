module TestOtherwise (test) where
import Prelude
test :: Boolean -> Int
test b = case b of
  true -> 1
  _ | otherwise -> 2
