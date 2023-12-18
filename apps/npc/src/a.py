import numpy as np
import datetime, hashlib
i = 100
t = datetime.datetime.now

print(i % 88)
print(hashlib.sha256(t.encode('utf-8')).hexdigest())
