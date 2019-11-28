run:
	cpp < one-block.z3 | grep -v '^#' > one-block.z3i
	z3 one-block.z3i | tr '\n' '%' | sed 's/Int%/Int /g' | sed 's/   / /g' | tr '%' '\n' | grep 'define-fun' | sort


