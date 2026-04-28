Form of [[AI Alignment|AI alignment]] where we remove a dangerous concept/capability from a model.

Unlike relying on suppression of dangerous concepts, we remove them entirely by constructing a **projection matrix** that will nullify or orthogonalize the subspace of this concept from the weights.

This can also make a model dumber as you potentially also erased some entangled features that were useful for normal work.

Models sometimes [[Sandbagging|sandbag]] to prevent this, worrying that it would make them less helpful.