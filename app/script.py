def solve():
    # Read input
    a, b, c = map(int, input().split())  # The numbers that need to be divisors
    x, y, z = map(int, input().split())  # The sequence numbers
    
    # Function to calculate minimum operations needed for a number to be divisible by a target
    def min_ops(num, target):
        if num % target == 0:
            return 0
        return target - (num % target)
    
    # Try all possible combinations of which number to make divisible by which divisor
    min_total = float('inf')
    
    # Try all permutations of assignments
    for i in range(3):
        for j in range(3):
            for k in range(3):
                if i != j and j != k and i != k:  # Ensure different assignments
                    # Get the numbers in order
                    nums = [x, y, z]
                    # Get the targets in order
                    targets = [a, b, c]
                    
                    # Calculate operations needed
                    ops = 0
                    ops += min_ops(nums[i], targets[0])
                    ops += min_ops(nums[j], targets[1])
                    ops += min_ops(nums[k], targets[2])
                    
                    min_total = min(min_total, ops)
    
    return min_total

# Read number of test cases
t = int(input())
for _ in range(t):
    print(solve())
