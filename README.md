# Pathfinding Visualizer

A interactive web application to visualize pathfinding algorithms and maze generation. Watch as different algorithms explore a grid to find the shortest path from start to end node.

## Features

- **Interactive Grid**: 20x50 cell grid with smooth drag-and-drop interactions
- **Three Pathfinding Algorithms**:
  - **Dijkstra's Algorithm**: Guarantees shortest path, explores equally in all directions
  - **A* Algorithm**: Guarantees shortest path, faster than Dijkstra using Manhattan distance heuristic
  - **Breadth First Search (BFS)**: Guarantees shortest path in unweighted grids
- **Maze Generation**: Recursive division algorithm for random maze creation
- **Smooth Animations**: CSS keyframe animations for path visualization
- **Dark Theme**: Eye-friendly dark UI with vibrant colors
- **Responsive Design**: Works on desktop and mobile devices
- **Legend**: Shows what each cell color means

## How to Use

### Basic Controls
- **Drag the green node** to move the start position
- **Drag the red node** to move the end position
- **Click and drag** to draw/erase walls (white cells)
- Select an algorithm from the dropdown
- Click **Visualize** to watch the algorithm find the path
- Click **Generate Maze** to create a random maze
- **Clear Path** removes animation but keeps walls
- **Clear Board** resets everything

### Color Legend
- **Green**: Start node
- **Red**: End node
- **White**: Wall
- **Blue/Purple (animated)**: Visited cells during exploration
- **Yellow (animated)**: Final shortest path

## Algorithm Details

### Dijkstra's Algorithm
- **Time Complexity**: O((V + E) log V) where V is vertices, E is edges
- **Space Complexity**: O(V)
- **Characteristics**: 
  - Guarantees shortest path
  - Expands nodes in all directions equally
  - Good for understanding basic pathfinding
  - Can be slower than A*

### A* Algorithm
- **Time Complexity**: O((V + E) log V)
- **Space Complexity**: O(V)
- **Characteristics**:
  - Guarantees shortest path
  - Uses Manhattan distance heuristic for direction
  - Faster than Dijkstra in most cases
  - Uses informed search to prioritize promising nodes

### Breadth First Search (BFS)
- **Time Complexity**: O(V + E)
- **Space Complexity**: O(V)
- **Characteristics**:
  - Guarantees shortest path in unweighted grids
  - Explores all neighbors at current depth before moving to next
  - Simple and efficient for unweighted graphs
  - Best for large unweighted grids

### Maze Generation (Recursive Division)
- **Algorithm**: Recursive division with passage generation
- **Time Complexity**: O(V) where V is total cells
- **Space Complexity**: O(depth of recursion) ≈ O(log(max(rows, cols)))

## Project Structure

```
pathfinding-visualizer/
├── src/
│   ├── components/
│   │   ├── Grid.jsx           # Main grid component with cell rendering
│   │   ├── Grid.css           # Grid styling and animations
│   │   ├── Navbar.jsx         # Controls and algorithm selection
│   │   ├── Navbar.css         # Navbar styling
│   │   ├── WelcomeModal.jsx   # Tutorial modal
│   │   ├── WelcomeModal.css   # Modal styling
│   │   ├── Toast.jsx          # Toast notifications
│   │   └── Toast.css          # Toast styling
│   ├── algorithms/
│   │   ├── dijkstra.js        # Dijkstra's algorithm
│   │   ├── astar.js           # A* algorithm
│   │   ├── bfs.js             # Breadth First Search
│   │   └── maze.js            # Recursive division maze generation
│   ├── App.jsx                # Main app component
│   ├── App.css                # App styling
│   ├── main.jsx               # React entry point
│   └── styles.css             # Global styles
├── public/
│   └── index.html             # HTML entry point
├── package.json               # Project dependencies
├── vite.config.js             # Vite configuration
└── README.md                  # This file
```

## Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pathfinding-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The optimized build will be in the `dist/` directory.

## Technical Highlights

### Smooth Animations
- CSS keyframe animations for visited and path cells
- 10ms delay between visited cell animations
- 50ms delay between path cell animations
- Ripple and fade effects for visual feedback

### Performance Optimizations
- Efficient grid updates using React hooks
- Grid node cloning to prevent mutations
- Event delegation for mouse interactions
- CSS transitions for smooth 60fps animations

### User Experience
- Welcome modal with instructions on first load
- Disabled controls during animation
- Toast notifications for user feedback
- Responsive grid that adapts to screen size
- Smooth dragging without flickering

## Browser Compatibility

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips & Tricks

1. **Testing Different Algorithms**: Generate a maze and run each algorithm to see the differences in exploration patterns
2. **Custom Patterns**: Try drawing interesting wall patterns to see how different algorithms adapt
3. **Start/End Positions**: Drag the start and end nodes while hovering to see how the positions update in real-time
4. **Performance**: The grid can handle large explorations efficiently with the animations

## License

This project is open source and available under the MIT License.

## Future Enhancements

- Additional algorithms (Greedy Best First, Bidirectional Search)
- Weighted cells with different costs
- Step-by-step execution mode
- Statistics display (path length, nodes explored, time taken)
- Multiple mazes and predefined obstacles
- Undo/Redo functionality
