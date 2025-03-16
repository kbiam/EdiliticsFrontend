# Interactive Data Visualization with D3.js & React

This project demonstrates the integration of D3.js with React to create interactive data visualizations.

## Features

### Chart Types
- **Bar Chart**: Displays data as vertical bars with color-coding by category
- **Line Chart**: Shows data trends over time with smooth transitions
- **Pie Chart**: Visualizes data by category proportions with animated rendering

### Interactive Features
1. **Tooltips**: Hover over any data point to see detailed information
2. **Dynamic Data Updates**: Add random data points that animate into the visualization
3. **Zoom & Pan**: Use the mouse wheel to zoom and drag to pan around bar and line charts
4. **Legends**: Interactive category legends for better data interpretation
5. **Theme Switching**: Toggle between light and dark modes
6. **Data Filtering**: Filter data by category with checkboxes
7. **Responsive Design**: Charts adapt to different screen sizes
8. **Smooth Transitions**: Data changes are animated with smooth transitions

## Technology Stack

- **React**: For building the UI components and managing state
- **D3.js**: For data visualization and DOM manipulation
- **CSS**: For styling and responsiveness

## Project Structure

```
src/
├── components/
│   ├── Chart.jsx       # Main chart component with D3.js integration
│   ├── Chart.css       # Chart-specific styles
│   ├── ControlPanel.jsx # Controls for chart type, data, and filters
│   ├── ControlPanel.css # Control panel styles
│   ├── Tooltip.jsx     # Tooltip component for data point details
│   └── Tooltip.css     # Tooltip styles
├── utils/
│   └── dataUtils.js    # Utility functions for data generation
├── App.jsx             # Main application component
├── App.css             # Application-wide styles
├── index.js            # Entry point
└── index.css           # Global styles
```

## Setup and Installation

1. **Clone the repository**:
   ```
   git clone https://github.com/kbiam/EdiliticsFrontend.git
   ```

2. **Install dependencies**:
   ```
   npm install
   ```

3. **Run the development server**:
   ```
   npm run dev
   ```

4. **Open your browser** to `http://localhost:5173`

## How It Works

### D3.js and React Integration

This project demonstrates an effective approach to integrating D3.js with React:

- React manages the component lifecycle and state
- D3.js handles the SVG manipulation and data binding
- React's useRef hook is used to give D3 access to the DOM
- React's useEffect hook is used to trigger D3 updates based on data changes

### State Management

The application uses React's useState hook to manage:
- Chart data
- Selected chart type
- Theme preference
- Category filters
- Tooltip state

### Responsive Design

The charts automatically resize based on the container width, ensuring they look good on various screen sizes.
