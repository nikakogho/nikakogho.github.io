With [[SAM files|SAM]], [[BAM files|BAM]] and [[CRAM Files|CRAM]] files.

## Usage
### view - Convert SAM to BAM
`samtools view -bS aln.sam > aln.bam`

### view - Alignments in a Specific Region
`samtools view aln.sorted.bam chr1:1,000,000-1,001,000`

### sort - Sort a BAM file
`samtools sort aln.bam -o aln.sorted.bam`

### index - Index a sorted BAM file
`samtools index aln.sorted.bam`

### flagstat - Get Alignment Statistics
`samtools flagstat aln.sorted.bam`

Where `aln.sorted.bam` is a sorted and indexed BAM file

### mpileup - Pileup for Variant Calling
`samtools mpileup -uf reference.fasta aln.sorted.bam > my.bcf`

Output as [[BCF File]] (Binary Cell Format), which can then be used with [[BCFtools]] for [[Variant Calling]]
