Compact Idiosyncratic Gapped Alignment Report

String that encodes how a read aligns to reference genome
Example: 5M2I4M3D6M

Actual read won't perfectly match reference genome because of insertions deletions mismatches and such.
CIGAR string encodes these differences.
Like a specialized version of the [Edit Distance algorithm](https://medium.com/@ethannam/understanding-the-levenshtein-distance-equation-for-beginners-c4285a5604f0).

## Operations
- M - match
- I - insertion: these parts exist in the read but not in reference
- D - deletion: these parts exist in reference but not in read
	- exist in middle, not start or end, since read is not a full genome read
- N - skipped region from reference, often for introns
- S - soft clipping (not aligned at start or end but present in read)
- H - hard clipping (not aligned and not present in read)
- = Exact match
- X - mismatch (equivalent to "update" in edit distance algorithm)

## Examples
1)
Reference Sequence:
AGCTTCGTGAAATTGCCC

Read Sequence:
AGCTTAACGTGTTGCCC

CIGAR string:
5M2I4M3D6M

- **5M**: The first 5 bases of the read match the reference: AGCTT
- **2I**: The next 2 bases are inserted in the read that are not present in the reference: AA
- **4M**: The next 4 bases match the reference: CGTG
- **3D**: The reference has 3 bases that are deleted in the read: AAA
- **6M**: The final 6 bases of the read match the reference: TTGCCC

In summary, this read has:
- **Matched** with the reference at three places (5 bases, 4 bases, and 6 bases).
- **Inserted** 2 bases that don’t exist in the reference.
- **Deleted** 3 bases that exist in the reference but are missing in the read.

2)
**Reference Sequence**: 
`AGCTTAGGCA` 
**Read Sequence**: 
`AGCTTATGCA`

**CIGAR String**: `6M1X3M`

**Explanation**:

- **6M**: The first 6 bases `AGCTTA` match the reference exactly.
- **1X**: There is a mismatch at position 7, where the reference has `G`, but the read has `T`.
- **3M**: The final 3 bases `GCA` match the reference.

3) Skipped Region (N)

**Reference Sequence**: 
`AGCTT---AGGCA` 
**Read Sequence**:
`AGCTTAGGCA`

**CIGAR String**: `5M3N5M`

**Explanation**:

- **5M**: The first 5 bases `AGCTT` match the reference.
- **3N**: There is a region of 3 bases in the reference that is skipped, represented by dashes `---`. This is common in RNA sequencing, where introns (non-coding regions) are skipped during transcription.
- **5M**: The final 5 bases `AGGCA` match the reference.
