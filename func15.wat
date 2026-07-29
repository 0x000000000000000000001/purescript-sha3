3269: (func $15 (param $0 eqref) (param $1 eqref) (param $2 eqref) (result eqref)
3270-  (local $3 (ref $0))
3271-  (local $4 (ref $1))
3272-  (local $5 (ref $3))
3273-  (local $6 (ref i31))
3274-  (local $7 (ref i31))
3275-  (local $8 (ref i31))
3276-  (local $9 i32)
3277-  (local $10 i32)
3278-  (local $11 i32)
3279-  (local.set $9
3280-   (i32.add
3281-    (call $54
3282-     (array.len
3283-      (struct.get $3 0
3284-       (local.tee $5
3285-        (ref.cast (ref $3)
3286-         (local.get $2)
3287-        )
3288-       )
3289-      )
3290-     )
3291-     (struct.get $1 0
3292-      (local.tee $4
3293-       (ref.cast (ref $1)
3294-        (local.get $0)
3295-       )
3296-      )
3297-     )
3298-    )
3299-    (i32.const 1)
3300-   )
3301-  )
3302-  (local.set $9
3303-   (call $54
3304-    (i32.mul
3305-     (local.get $9)
3306-     (local.tee $10
3307-      (struct.get $1 0
3308-       (local.get $4)
3309-      )
3310-     )
3311-    )
3312-    (local.get $10)
3313-   )
3314-  )
3315-  (local.set $3
3316-   (ref.cast (ref $0)
3317-    (call $10
3318-     (struct.new_default $1)
3319-     (array.new_default $0
3320-      (i32.const 50)
3321-     )
3322-    )
3323-   )
3324-  )
3325-  (local.set $6
3326-   (ref.i31
3327-    (i32.const 0)
3328-   )
3329-  )
3330-  (local.set $7
3331-   (ref.i31
3332-    (i32.const 2)
3333-   )
3334-  )
3335-  (local.set $8
3336-   (ref.i31
3337-    (i32.const 1)
3338-   )
3339-  )
3340-  (return_call $13
3341-   (local.get $1)
3342-   (if (result (ref $0))
3343-    (i31.get_s
3344-     (select (result (ref i31))
3345-      (local.get $6)
3346-      (select (result (ref i31))
3347-       (local.get $8)
3348-       (local.get $7)
3349-       (local.get $9)
3350-      )
3351-      (i32.gt_s
3352-       (local.get $9)
3353-       (i32.const 0)
3354-      )
3355-     )
3356-    )
3357-    (then
3358-     (local.get $3)
3359-    )
3360-    (else
3361-     (local.set $11
3362-      (i32.add
3363-       (call $54
3364-        (local.tee $9
3365-         (array.len
3366-          (struct.get $3 0
3367-           (local.get $5)
3368-          )
3369-         )
3370-        )
3371-        (local.tee $10
3372-         (struct.get $1 0
3373-          (local.get $4)
3374-         )
3375-        )
3376-       )
3377-       (i32.const 1)
3378-      )
3379-     )
3380-     (local.set $3
3381-      (ref.cast (ref $0)
3382-       (call $12
3383-        (local.tee $3
3384-         (ref.cast (ref $0)
3385-          (call $14
3386-           (local.get $4)
3387-           (local.get $5)
3388-           (struct.new $1
3389-            (local.get $9)
3390-           )
3391-           (struct.new $1
3392-            (i32.mul
3393-             (local.get $10)
3394-             (local.get $11)
3395-            )
3396-           )
3397-           (struct.new_default $1)
3398-           (struct.new_default $1)
3399-           (local.get $3)
3400-          )
3401-         )
3402-        )
3403-        (call $11
3404-         (local.get $3)
3405-         (array.new_default $0
3406-          (i32.const 10)
3407-         )
3408-         (struct.new_default $1)
3409-        )
3410-        (struct.new_default $1)
3411-       )
3412-      )
3413-     )
3414-     (drop
3415-      (call $54
3416-       (i32.const 0)
3417-       (i32.const 5)
3418-      )
3419-     )
3420-     (drop
3421-      (call $54
3422-       (i32.const 0)
3423-       (i32.const 5)
3424-      )
3425-     )
3426-     (drop
3427-      (array.get $0
3428-       (local.get $3)
3429-       (i32.const 0)
3430-      )
3431-     )
3432-     (drop
3433-      (array.get $0
3434-       (local.get $3)
3435-       (i32.const 1)
3436-      )
3437-     )
3438-     (drop
3439-      (call $54
3440-       (i32.const 0)
3441-       (i32.const 5)
3442-      )
3443-     )
3444-     (unreachable)
3445-    )
3446-   )
3447-   (struct.new_default $1)
3448-   (struct.new $3
3449-    (array.new_default $0
3450-     (struct.get $1 0
3451-      (ref.cast (ref $1)
3452-       (local.get $1)
3453-      )
3454-     )
3455-    )
3456-   )
3457-  )
3458- )
3459- (func $16 (result i32)
3460-  (struct.get $1 0
3461-   (ref.cast (ref $1)
3462-    (global.get $global$0)
3463-   )
3464-  )
3465- )
3466- (func $17 (result eqref)
3467-  (call $fimport$0
3468-   (struct.new $3
3469-    (array.new_fixed $0 46
