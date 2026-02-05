# Result Filtering Features

## Overview
Enhanced the ResultCard component with comprehensive filtering capabilities for contest results.

## New Features

### 1. **Date Range Filter**
- Filter results by submission date
- Select "From Date" and "To Date" to narrow results
- Works inclusively (results >= from AND <= to)

### 2. **Gender Filter**
- Filter by gender: All, Male, Female, or Other
- Case-insensitive matching
- Displays gender in result cards for verification

### 3. **Marks-Based Filtering**
Four options available:
- **No Filter**: Shows all results (default)
- **Top Scorers**: Shows top N students by marks (descending order)
  - Configurable count (default: 10)
  - Input field appears when selected
- **Bottom Scorers**: Shows bottom N students by marks (ascending order)
  - Configurable count (default: 10)
  - Input field appears when selected
- **Marks Range**: Filter by minimum and maximum marks
  - Two input fields for min/max values
  - Inclusive range (min <= marks <= max)

## How It Works

### Filter Application
All filters work together:
1. **Date filter** is applied first (if set)
2. **Gender filter** is applied to remaining results (if not "all")
3. **Marks filter/sort** is applied last (if not "none")

### UI Layout
- Responsive grid layout (1-3 columns based on screen size)
- Conditional inputs appear based on selected marks filter type
- "Apply Filters" button triggers all filters
- "Reset" button clears all filters and shows all results
- Real-time counter shows "Showing X of Y results"

### Result Display
Each result card now shows:
- Student name
- **Gender** (newly added)
- Total marks
- Time taken (formatted as hours, minutes, seconds)
- Submission date/time
- Profile picture
- Download button

## Technical Implementation

### State Management
```typescript
const [fromDate, setFromDate] = useState<string>("");
const [toDate, setToDate] = useState<string>("");
const [genderFilter, setGenderFilter] = useState<string>("all");
const [marksSortType, setMarksSortType] = useState<string>("none");
const [topBottomCount, setTopBottomCount] = useState<number>(10);
const [minMarks, setMinMarks] = useState<string>("");
const [maxMarks, setMaxMarks] = useState<string>("");
```

### Filter Logic
The `applyFilters()` function:
1. Creates a copy of original results
2. Applies date filter if dates are set
3. Applies gender filter if not "all"
4. Applies marks filter/sort based on selected type
5. Updates `filteredResults` state

### Reset Functionality
The `resetFilters()` function clears all filter states and restores original results.

## Usage Example

**Example 1: Find top 5 male students**
1. Set Gender: Male
2. Set Marks Filter: Top Scorers
3. Set Count: 5
4. Click "Apply Filters"

**Example 2: Find students who scored between 20-30 marks and submitted on a specific date**
1. Set From Date: 2024-11-27
2. Set To Date: 2024-11-27
3. Set Marks Filter: Marks Range
4. Set Min Marks: 20
5. Set Max Marks: 30
6. Click "Apply Filters"

## Interface Updates
Added `gender?: string` to the `UserData` interface to support gender filtering and display.
