"""
Detailed context data for every algorithm in the DSA Visualizer.
Used to give Claude precise, accurate information when answering questions.
"""

ALGORITHM_DATA = {

    # ─────────────────────────────────────────────
    # PATHFINDING
    # ─────────────────────────────────────────────

    "Dijkstra's Algorithm": {
        'category': 'Pathfinding',
        'time_complexity': {
            'best': 'O((V + E) log V)',
            'average': 'O((V + E) log V)',
            'worst': 'O((V + E) log V)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Guarantees shortest path on weighted graphs',
            'Uses a priority queue (min-heap)',
            'Explores nodes in order of cumulative distance from start',
            'Cannot handle negative edge weights',
            'Greedy algorithm',
        ],
        'use_cases': [
            'GPS navigation systems',
            'Network routing protocols (OSPF)',
            'Maps and directions',
            'Game AI pathfinding',
        ],
        'interview_questions': [
            'Why can\'t Dijkstra handle negative weights?',
            'What data structure makes Dijkstra efficient?',
            'How does Dijkstra differ from BFS?',
            'What is the time complexity with a simple array vs priority queue?',
        ],
        'watch_for': [
            'Purple/blue cells spreading outward from start — these are visited nodes',
            'The algorithm explores in rings of increasing distance from the start',
            'Yellow path at the end traces back the shortest route',
            'Notice it explores more cells near walls as it searches around obstacles',
        ],
        'comparison': {
            'vs_astar': 'A* adds a heuristic to bias search toward the goal, visiting fewer nodes',
            'vs_bfs': 'BFS finds shortest path by hops; Dijkstra finds shortest by total weight',
        },
    },

    'A* Search': {
        'category': 'Pathfinding',
        'time_complexity': {
            'best': 'O(E)',
            'average': 'O(E log V)',
            'worst': 'O(b^d) — exponential in worst case',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Combines Dijkstra\'s cost-so-far with a heuristic estimate to goal',
            'f(n) = g(n) + h(n) where g is actual cost, h is heuristic estimate',
            'Optimal and complete when heuristic is admissible (never overestimates)',
            'Typically uses Manhattan or Euclidean distance as heuristic',
            'Faster than Dijkstra on most practical graphs',
        ],
        'use_cases': [
            'Game pathfinding (most games use A*)',
            'Robotics motion planning',
            'Navigation apps when you know the goal',
            'Puzzle solving (8-puzzle, 15-puzzle)',
        ],
        'interview_questions': [
            'What makes a heuristic admissible?',
            'What happens when h(n) = 0? (becomes Dijkstra)',
            'What happens when h(n) >> g(n)? (becomes greedy best-first)',
            'How does A* differ from Dijkstra?',
        ],
        'watch_for': [
            'Notice the search front is biased toward the goal — fewer cells explored than Dijkstra',
            'The algorithm stretches toward the end node rather than expanding in all directions',
            'In open space, A* finds the path very quickly',
            'With maze walls, it may still explore many nodes to find a way around',
        ],
        'comparison': {
            'vs_dijkstra': 'Dijkstra explores uniformly; A* is guided toward the goal by heuristic',
            'vs_greedy': 'Greedy only looks at h(n) — not optimal; A* also tracks actual cost g(n)',
        },
    },

    'Breadth-First Search (BFS)': {
        'category': 'Pathfinding / Graph',
        'time_complexity': {
            'best': 'O(V + E)',
            'average': 'O(V + E)',
            'worst': 'O(V + E)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Explores all neighbors at current depth before going deeper',
            'Uses a queue (FIFO)',
            'Guarantees shortest path on unweighted graphs',
            'Explores in "layers" or "rings" from the start',
            'Complete — always finds a solution if one exists',
        ],
        'use_cases': [
            'Shortest path in unweighted graphs',
            'Social network connections ("6 degrees of separation")',
            'Web crawlers',
            'Finding connected components',
            'Level-order tree traversal',
        ],
        'interview_questions': [
            'Why does BFS guarantee shortest path on unweighted graphs?',
            'When would you use BFS vs DFS?',
            'What is the space complexity difference between BFS and DFS?',
            'How do you find the shortest path between two nodes?',
        ],
        'watch_for': [
            'Watch how it explores in a perfect ring/wave pattern outward from the start',
            'It visits every cell at distance 1, then every cell at distance 2, etc.',
            'The wave pattern is very symmetric in open space',
            'This level-by-level exploration is why it guarantees the shortest path',
        ],
        'comparison': {
            'vs_dfs': 'DFS goes deep first using a stack; BFS goes wide using a queue',
            'vs_dijkstra': 'BFS finds shortest hops; Dijkstra finds shortest weighted distance',
        },
    },

    'Depth-First Search (DFS)': {
        'category': 'Pathfinding / Graph',
        'time_complexity': {
            'best': 'O(V + E)',
            'average': 'O(V + E)',
            'worst': 'O(V + E)',
        },
        'space_complexity': 'O(V) — recursion stack depth',
        'characteristics': [
            'Explores as far as possible down each branch before backtracking',
            'Uses a stack (or recursion)',
            'Does NOT guarantee shortest path',
            'Can get "stuck" going deep in one direction before exploring others',
            'More memory-efficient than BFS in deep graphs',
        ],
        'use_cases': [
            'Maze generation and solving',
            'Topological sorting',
            'Detecting cycles in graphs',
            'Finding strongly connected components (Tarjan\'s, Kosaraju\'s)',
            'Solving puzzles with backtracking',
        ],
        'interview_questions': [
            'Why doesn\'t DFS guarantee shortest path?',
            'What are pre-order, in-order, post-order traversals?',
            'How is iterative DFS different from recursive DFS?',
            'When would you choose DFS over BFS?',
        ],
        'watch_for': [
            'Notice how it shoots off in one direction and goes deep before backtracking',
            'It often finds a path quickly but not necessarily the shortest one',
            'The explored path looks like a snake that doubles back on itself',
            'Compare the number of visited nodes with BFS — often explores differently',
        ],
        'comparison': {
            'vs_bfs': 'BFS explores broadly and guarantees shortest; DFS explores deeply and is faster to find *a* path',
        },
    },

    'Greedy Best-First Search': {
        'category': 'Pathfinding',
        'time_complexity': {
            'best': 'O(E log V)',
            'average': 'O(E log V)',
            'worst': 'O(b^d)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Always moves toward the node that looks closest to the goal',
            'Uses only the heuristic h(n) — ignores actual cost traveled',
            'Not guaranteed to find the shortest path',
            'Usually faster than Dijkstra but can be mislead by obstacles',
            'The "greedy" name refers to always picking what looks locally best',
        ],
        'use_cases': [
            'When speed matters more than optimality',
            'Navigating in environments with few obstacles',
            'As a component in more sophisticated planners',
        ],
        'interview_questions': [
            'Why doesn\'t greedy best-first guarantee shortest path?',
            'How does it differ from A*?',
            'When is greedy best-first preferred over A*?',
        ],
        'watch_for': [
            'Notice how it beelines straight toward the goal — very directed',
            'It can get confused by walls and have to heavily backtrack',
            'Compared to A*, it explores fewer nodes in open space but more when there are obstacles',
            'The path it finds might curve inefficiently around obstacles',
        ],
        'comparison': {
            'vs_astar': 'A* tracks actual cost g(n) too, making it optimal; Greedy is faster but not optimal',
            'vs_dijkstra': 'Dijkstra ignores direction to goal; Greedy ignores cost traveled so far',
        },
    },

    'Maze Generation': {
        'category': 'Pathfinding / Maze',
        'time_complexity': {
            'best': 'O(V)',
            'average': 'O(V)',
            'worst': 'O(V)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Uses recursive division algorithm to partition space into rooms',
            'Creates a perfect maze — exactly one path between any two cells',
            'Divides grid recursively with walls, adding a single passage in each wall',
            'Deterministic given a seed; random passage placement creates variety',
        ],
        'use_cases': [
            'Game level generation',
            'Testing pathfinding algorithms',
            'Procedural content generation',
        ],
        'watch_for': [
            'Watch walls appear as recursive division splits the space',
            'Each subdivision gets exactly one passage',
            'The result is a connected maze with exactly one solution path',
        ],
    },

    # ─────────────────────────────────────────────
    # SORTING
    # ─────────────────────────────────────────────

    'Bubble Sort': {
        'category': 'Sorting',
        'time_complexity': {
            'best': 'O(n) — already sorted (with early exit)',
            'average': 'O(n²)',
            'worst': 'O(n²)',
        },
        'space_complexity': 'O(1) — in-place',
        'characteristics': [
            'Repeatedly swaps adjacent elements if they are in the wrong order',
            'Largest unsorted element "bubbles" to the end each pass',
            'Simple to implement but very inefficient',
            'Stable sort — equal elements maintain their relative order',
            'Only efficient if the array is nearly sorted',
        ],
        'use_cases': [
            'Education — easiest sort to understand and visualize',
            'Nearly-sorted data (only a few elements out of place)',
            'When simplicity of code matters more than performance',
        ],
        'interview_questions': [
            'What is the best-case time complexity with the early-exit optimization?',
            'Why is bubble sort O(n²)?',
            'Is bubble sort stable? Why does stability matter?',
            'When would you actually use bubble sort in production?',
        ],
        'watch_for': [
            'Watch the orange bar (comparing) move left-to-right through the array',
            'Red flashes are swaps — large elements bubble rightward',
            'Green bars accumulate on the right as each pass places one more element',
            'The number of swaps drops each pass as more elements are in place',
        ],
        'comparison': {
            'vs_selection': 'Selection sort does at most n swaps; Bubble can do O(n²) swaps',
            'vs_insertion': 'Insertion sort is much better on nearly-sorted data',
        },
    },

    'Selection Sort': {
        'category': 'Sorting',
        'time_complexity': {
            'best': 'O(n²)',
            'average': 'O(n²)',
            'worst': 'O(n²)',
        },
        'space_complexity': 'O(1) — in-place',
        'characteristics': [
            'Finds the minimum element and places it at the front',
            'Makes at most n-1 swaps — minimizes write operations',
            'Always O(n²) regardless of input — no early exit benefit',
            'Unstable sort — can change relative order of equal elements',
            'Simple to implement; better than bubble sort in terms of swaps',
        ],
        'use_cases': [
            'When write operations are expensive (flash memory)',
            'Small arrays where simplicity matters',
            'Understanding the selection pattern in more advanced algorithms',
        ],
        'interview_questions': [
            'Why is selection sort always O(n²)?',
            'Why is selection sort useful when writes are expensive?',
            'Is selection sort stable?',
            'How many swaps does selection sort make?',
        ],
        'watch_for': [
            'Watch it scan the entire unsorted portion to find the minimum (orange comparison)',
            'Then it makes exactly one swap to put the minimum in place (red swap)',
            'Green bars grow from the left — the sorted portion',
            'Count the swaps: always exactly n-1, regardless of the input',
        ],
        'comparison': {
            'vs_bubble': 'Selection sort always makes fewer swaps but same comparisons',
            'vs_insertion': 'Insertion sort adapts to nearly-sorted input; selection sort never does',
        },
    },

    'Insertion Sort': {
        'category': 'Sorting',
        'time_complexity': {
            'best': 'O(n) — already sorted',
            'average': 'O(n²)',
            'worst': 'O(n²)',
        },
        'space_complexity': 'O(1) — in-place',
        'characteristics': [
            'Builds the sorted array one element at a time',
            'Each element is inserted into its correct position in the sorted prefix',
            'Excellent on nearly-sorted data',
            'Stable sort',
            'Online — can sort a list as it receives it',
            'Used as base case in hybrid sorts (TimSort uses insertion sort for small chunks)',
        ],
        'use_cases': [
            'Nearly-sorted arrays — runs in almost O(n)',
            'Small arrays (Python, Java use it for small subarrays)',
            'Online sorting (streaming data)',
            'As a component in merge sort or Tim sort for small n',
        ],
        'interview_questions': [
            'Why is insertion sort good for nearly-sorted data?',
            'What is TimSort and why does it use insertion sort?',
            'Is insertion sort stable?',
            'Compare insertion sort vs merge sort for a small array of 10 elements',
        ],
        'watch_for': [
            'Watch the "key" element get picked up and slide left until it finds its spot',
            'Elements to the right of the key shift right to make room',
            'The left portion grows as a sorted subarray with each iteration',
            'On a nearly-sorted array, it barely moves — watch how few operations it takes',
        ],
        'comparison': {
            'vs_bubble': 'Insertion sort is more efficient — fewer comparisons on average',
            'vs_merge': 'Merge sort is O(n log n) always; insertion sort is faster for small n',
        },
    },

    'Merge Sort': {
        'category': 'Sorting',
        'time_complexity': {
            'best': 'O(n log n)',
            'average': 'O(n log n)',
            'worst': 'O(n log n)',
        },
        'space_complexity': 'O(n) — requires auxiliary array',
        'characteristics': [
            'Divide-and-conquer: split array in half recursively until single elements',
            'Merge sorted halves back together',
            'Guaranteed O(n log n) in all cases',
            'Stable sort — important for sorting objects with multiple keys',
            'Not in-place — requires O(n) extra space',
            'Preferred for linked lists (no random access needed)',
        ],
        'use_cases': [
            'When stability is required (sort by name, then by age)',
            'External sorting (sorting data that doesn\'t fit in RAM)',
            'Linked list sorting',
            'Used in Java\'s Arrays.sort() for objects',
        ],
        'interview_questions': [
            'Why is merge sort O(n log n)?',
            'What is the recurrence relation for merge sort?',
            'When would you use merge sort vs quicksort?',
            'How do you merge two sorted arrays in O(n)?',
        ],
        'watch_for': [
            'Watch bars rearrange as merging happens — small sorted runs combine into larger ones',
            'The orange comparison bars show two pointers walking through two halves',
            'Each merge pass doubles the sorted chunk size',
            'The log n "layers" of merging are visible as distinct phases',
        ],
        'comparison': {
            'vs_quicksort': 'Merge sort is stable and O(n log n) always; quicksort is faster in practice but O(n²) worst case',
            'vs_insertion': 'Merge sort wins for large n; insertion sort wins for n < ~20',
        },
    },

    'Quick Sort': {
        'category': 'Sorting',
        'time_complexity': {
            'best': 'O(n log n)',
            'average': 'O(n log n)',
            'worst': 'O(n²) — when pivot is always min/max',
        },
        'space_complexity': 'O(log n) average — recursion stack',
        'characteristics': [
            'Divide-and-conquer: pick a pivot, partition around it, recurse',
            'Elements less than pivot go left; greater go right',
            'In-place (ignoring recursion stack)',
            'Not stable in its basic form',
            'Fastest in practice despite O(n²) worst case',
            'Cache-friendly — accesses memory sequentially',
        ],
        'use_cases': [
            'General-purpose sorting (fastest in practice)',
            'C stdlib qsort, most language default sort algorithms',
            'When in-place sorting with low overhead is needed',
            'When average case matters more than worst case',
        ],
        'interview_questions': [
            'What is the worst case for quicksort and how do you avoid it?',
            'What is 3-way partition quicksort?',
            'Why is quicksort faster than merge sort in practice?',
            'How do you choose a pivot? (random, median-of-3)',
        ],
        'watch_for': [
            'Watch the pivot (often the rightmost element) being placed into its final position',
            'Orange comparisons show elements being checked against the pivot',
            'Red swaps move smaller elements to the left side',
            'After each partition, the pivot is in its final sorted position (turns green)',
        ],
        'comparison': {
            'vs_merge': 'Quicksort is faster in practice (cache locality, smaller constants) but not stable',
            'vs_insertion': 'Quicksort is much better for large arrays; insertion sort wins for small n',
        },
    },

    # ─────────────────────────────────────────────
    # TREE / BST
    # ─────────────────────────────────────────────

    'Binary Search Tree': {
        'category': 'Tree / Data Structure',
        'time_complexity': {
            'best': 'O(log n) for balanced tree',
            'average': 'O(log n)',
            'worst': 'O(n) for degenerate (linked list) tree',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'Each node has at most two children',
            'Left subtree contains only nodes with values less than parent',
            'Right subtree contains only nodes with values greater than parent',
            'In-order traversal yields sorted sequence',
            'Performance degrades to O(n) when unbalanced',
            'Self-balancing variants (AVL, Red-Black) guarantee O(log n)',
        ],
        'use_cases': [
            'Ordered data storage with fast search, insert, delete',
            'Implementation of maps and sets (std::map in C++ uses Red-Black tree)',
            'Range queries',
            'Auto-complete and prefix search',
        ],
        'interview_questions': [
            'What is the difference between BST and a Binary Tree?',
            'How do you delete a node with two children?',
            'What makes a BST balanced? (AVL vs Red-Black)',
            'What is the in-order successor of a node?',
            'How do you check if a binary tree is a valid BST?',
        ],
        'watch_for': [
            'Blue highlighted nodes show the search path — watch how it makes left/right decisions',
            'Green highlight means the node was found',
            'For traversals, watch the order nodes light up: in-order gives sorted sequence',
            'Try inserting sorted values to see the tree degenerate into a linked list',
        ],
        'traversals': {
            'inorder': 'Left → Root → Right — produces sorted output',
            'preorder': 'Root → Left → Right — used to copy/serialize tree',
            'postorder': 'Left → Right → Root — used to delete tree, calculate directory sizes',
        },
    },

    # ─────────────────────────────────────────────
    # HEAP
    # ─────────────────────────────────────────────

    'Heap Data Structure': {
        'category': 'Tree / Data Structure',
        'time_complexity': {
            'best': 'O(1) for peek-min/peek-max',
            'average': 'O(log n) for insert/delete',
            'worst': 'O(log n) for insert/delete',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'Complete binary tree stored in an array (parent at i, children at 2i+1 and 2i+2)',
            'Max-heap: parent is always larger than children',
            'Min-heap: parent is always smaller than children',
            'Efficient priority queue implementation',
            'Build heap from array: O(n) — counter-intuitive but proven',
            'Used in heapsort: O(n log n)',
        ],
        'use_cases': [
            'Priority queues (task schedulers, Dijkstra\'s algorithm)',
            'Heap sort',
            'Finding the k-th largest/smallest element',
            'Median maintenance with two heaps',
            'Event simulation',
        ],
        'interview_questions': [
            'Why is building a heap O(n) rather than O(n log n)?',
            'How do you find the k-th largest element using a heap?',
            'What is the parent-child index relationship in a heap array?',
            'How do you implement a priority queue with a heap?',
            'What is the difference between a heap and a BST?',
        ],
        'watch_for': [
            'Watch the "heapify" operation bubble values up or down to restore the heap property',
            'The root is always the min or max',
            'Array representation: notice index math — parent of node i is at floor((i-1)/2)',
            'Insertion adds to the end then bubbles up; deletion removes root then bubbles down',
        ],
    },

    # ─────────────────────────────────────────────
    # GRAPH
    # ─────────────────────────────────────────────

    'Graph Traversal (BFS)': {
        'category': 'Graph',
        'time_complexity': {
            'best': 'O(V + E)',
            'average': 'O(V + E)',
            'worst': 'O(V + E)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'V = vertices (nodes), E = edges (connections)',
            'Explores all neighbors before going deeper',
            'Finds shortest path in unweighted graphs',
            'Uses a queue',
            'Discovers connected components',
        ],
        'use_cases': [
            'Shortest path (unweighted)',
            'Social network friend suggestions',
            'Web crawling',
            'Finding connected components',
        ],
        'watch_for': [
            'Watch nodes change color as they are discovered level by level',
            'BFS visits all nodes at distance 1, then distance 2, etc.',
            'The traversal tree shows the BFS tree structure',
        ],
    },

    'Graph Traversal (DFS)': {
        'category': 'Graph',
        'time_complexity': {
            'best': 'O(V + E)',
            'average': 'O(V + E)',
            'worst': 'O(V + E)',
        },
        'space_complexity': 'O(V)',
        'characteristics': [
            'Explores as far as possible along each branch before backtracking',
            'Uses a stack (or recursion)',
            'Useful for cycle detection, topological sort',
        ],
        'use_cases': [
            'Cycle detection',
            'Topological sorting (build order, course prerequisites)',
            'Finding strongly connected components',
            'Maze generation',
        ],
        'watch_for': [
            'Watch the traversal dive deep along one path before backtracking',
            'Notice the recursion stack depth compared to BFS',
        ],
    },

    # ─────────────────────────────────────────────
    # LINKED LIST
    # ─────────────────────────────────────────────

    'Linked List': {
        'category': 'Data Structure',
        'time_complexity': {
            'best': 'O(1) for insert/delete at head',
            'average': 'O(n) for search, insert/delete at arbitrary position',
            'worst': 'O(n)',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'Nodes connected by pointers — not stored contiguously in memory',
            'Dynamic size — no need to declare size upfront',
            'No random access — must traverse to reach element at index i',
            'O(1) insert/delete if you have a reference to the node',
            'Singly vs doubly linked — doubly allows backwards traversal',
        ],
        'use_cases': [
            'Implementing stacks and queues',
            'LRU cache (doubly linked list + hash map)',
            'Undo history in applications',
            'Polynomial arithmetic',
        ],
        'interview_questions': [
            'How do you detect a cycle in a linked list? (Floyd\'s tortoise-and-hare)',
            'How do you reverse a linked list?',
            'How do you find the middle element?',
            'How do you merge two sorted linked lists?',
        ],
        'watch_for': [
            'Watch pointer arrows update as nodes are inserted or deleted',
            'Deleting a node means updating the previous node\'s next pointer',
            'Notice how traversal must visit every node from the head',
        ],
    },

    # ─────────────────────────────────────────────
    # STACK & QUEUE
    # ─────────────────────────────────────────────

    'Stack': {
        'category': 'Data Structure',
        'time_complexity': {
            'best': 'O(1) push, pop, peek',
            'average': 'O(1)',
            'worst': 'O(1)',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'LIFO — Last In, First Out',
            'Push adds to top; Pop removes from top',
            'Only the top element is accessible',
            'Models function call stack, undo operations, expression evaluation',
        ],
        'use_cases': [
            'Function call stack (recursion)',
            'Undo/redo in editors',
            'Bracket matching and expression parsing',
            'DFS iterative implementation',
            'Browser back button',
        ],
        'interview_questions': [
            'Implement a stack that supports getMin() in O(1)',
            'How do you implement a queue using two stacks?',
            'How is the call stack related to recursion and stack overflow?',
            'Use a stack to evaluate a postfix expression',
        ],
        'watch_for': [
            'Elements are added and removed from the top only',
            'The LIFO order — last item pushed is the first popped',
        ],
    },

    'Queue': {
        'category': 'Data Structure',
        'time_complexity': {
            'best': 'O(1) enqueue, dequeue',
            'average': 'O(1)',
            'worst': 'O(1)',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'FIFO — First In, First Out',
            'Enqueue adds to rear; Dequeue removes from front',
            'Models waiting lines, task scheduling',
            'Circular queue avoids wasted space after dequeue',
        ],
        'use_cases': [
            'BFS traversal',
            'Task/job scheduling (OS process queue)',
            'Printer spooling',
            'Keyboard input buffer',
            'Asynchronous data transfer (streaming)',
        ],
        'interview_questions': [
            'Implement a queue using two stacks',
            'What is a priority queue and how does it differ from a regular queue?',
            'What is a circular queue and why is it used?',
            'Implement a deque (double-ended queue)',
        ],
        'watch_for': [
            'Elements enter from one end (rear) and leave from the other (front)',
            'FIFO order — first item enqueued is the first dequeued',
        ],
    },

    'Stack & Queue': {
        'category': 'Data Structure',
        'time_complexity': {
            'best': 'O(1) for all core operations',
            'average': 'O(1)',
            'worst': 'O(1)',
        },
        'space_complexity': 'O(n)',
        'characteristics': [
            'Stack: LIFO (Last In, First Out)',
            'Queue: FIFO (First In, First Out)',
            'Both support O(1) insert and delete at their respective ends',
            'Fundamental building blocks for more complex algorithms',
        ],
        'use_cases': [
            'Stack: function calls, undo, DFS, expression evaluation',
            'Queue: BFS, scheduling, buffering',
        ],
        'interview_questions': [
            'How do you implement a queue using two stacks?',
            'How do you implement a stack using two queues?',
            'What is a deque?',
            'When would you use a priority queue instead of a regular queue?',
        ],
        'watch_for': [
            'Stack: elements go in and come out from the same end (top)',
            'Queue: elements enter one end and leave the other',
        ],
    },

    # ─────────────────────────────────────────────
    # BINARY SEARCH
    # ─────────────────────────────────────────────

    'Binary Search': {
        'category': 'Search',
        'time_complexity': {
            'best': 'O(1) — target is the middle element',
            'average': 'O(log n)',
            'worst': 'O(log n)',
        },
        'space_complexity': 'O(1) iterative, O(log n) recursive',
        'characteristics': [
            'Requires sorted array',
            'Halves the search space with each comparison',
            'Compare middle element: if equal found; if less search right; if greater search left',
            'Extremely fast — 1 billion elements requires at most 30 comparisons',
            'Classic divide-and-conquer',
        ],
        'use_cases': [
            'Searching in sorted arrays or databases',
            'Finding insertion point (bisect in Python)',
            'Range queries on sorted data',
            'Searching in rotated sorted arrays',
            'Finding square roots, solving optimization problems',
        ],
        'interview_questions': [
            'What happens if there are duplicates?',
            'How do you find the first or last occurrence of a duplicate?',
            'Binary search on answer: "find minimum speed to finish task"',
            'Search in a rotated sorted array',
            'Why is binary search O(log n)?',
        ],
        'watch_for': [
            'Watch the left and right pointers narrow in on the target',
            'The middle element gets checked each time — watch it highlighted',
            'The search space halves every step — count how quickly it converges',
            'After log₂(n) steps it either finds the target or determines it\'s absent',
        ],
        'comparison': {
            'vs_linear': 'Linear search O(n): check every element. Binary search O(log n): requires sorted array',
        },
    },
}


def get_algorithm_context(algorithm_name: str) -> dict:
    """Get algorithm data, trying exact match then partial match."""
    if algorithm_name in ALGORITHM_DATA:
        return ALGORITHM_DATA[algorithm_name]

    # Try case-insensitive partial match
    lower = algorithm_name.lower()
    for key, value in ALGORITHM_DATA.items():
        if lower in key.lower() or key.lower() in lower:
            return value

    return {}
