function GridImagePuzzle() {
  // Using a high-quality image
  const imageUrl = "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=1200&q=80";
  
  // Grid configuration: you can customize each cell
  const gridConfig = [
    // Row 1
    { type: 'text', colSpan: 2, rowSpan: 1, content: 'Quality Construction Services', bg: 'bg-[#FF8D28]' },
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 0
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 1
     // 2-3 (spans 2 cols)
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 4
    
    // Row 2
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 5
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 6 (spans 2 rows down)
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 7
    { type: 'image', colSpan: 1, rowSpan: 1, content: 'Excellence', bg: 'bg-teal-700' }, // 8
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 9
    
    // Row 3
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 10
    // Grid [2,1] is occupied by item at [1,1] with rowSpan: 2
    { type: 'image', colSpan: 1, rowSpan: 1 }, // 11
     { type: 'image', colSpan: 1, rowSpan: 1 },
    { type: 'image', colSpan: 1, rowSpan: 1, content: 'Reliable Delivery', bg: 'bg-gray-800' }, // 12-13 (spans 2 cols)
    // Row 4
   { type: 'image', colSpan: 1, rowSpan: 1 },
   { type: 'image', colSpan: 1, rowSpan: 1 },
   { type: 'image', colSpan: 1, rowSpan: 1 },
   { type: 'image', colSpan: 1, rowSpan: 1 },
   { type: 'text', colSpan: 2, rowSpan: 1, content: 'Your Text', bg: 'bg-blue-600' },
   
   
//    // Row 5
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
   
//    // Row 6
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
//    { type: 'image', colSpan: 1, rowSpan: 1 },
  ];
  
  const getImagePosition = (actualRow, actualCol) => {
    return {
      backgroundImage: `url(${imageUrl})`,
      backgroundSize: '500% 400%',
      backgroundPosition: `${(actualCol * 100) / 4}% ${(actualRow * 100) / 3}%`,
    };
  };
  
  let currentVisualIndex = 0;
  
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Customizable Grid Image Display
        </h2>
        
        {/* Grid Container - 5 columns x 3 rows */}
        <div className="grid grid-cols-5 gap-0 w-full aspect-[5/4] shadow-2xl h-140">
          {(() => {
            let gridIndex = 0;
            const jsxElements = [];
            const occupiedCells = [];
            
            for (let row = 0; row < 4; row++) {
              for (let col = 0; col < 5; col++) {
                // Check if this cell is already occupied by a span
                const isOccupied = occupiedCells.some(
                  cell => 
                    col >= cell.startCol && 
                    col < cell.startCol + cell.colSpan &&
                    row >= cell.startRow && 
                    row < cell.startRow + cell.rowSpan
                );
                
                if (isOccupied) continue;
                
                // Get the current config item
                if (gridIndex >= gridConfig.length) break;
                const item = gridConfig[gridIndex];
                gridIndex++;
                
                // Track this cell's occupation
                occupiedCells.push({
                  startRow: row,
                  startCol: col,
                  rowSpan: item.rowSpan || 1,
                  colSpan: item.colSpan || 1
                });
                
                if (item.type === 'text') {
                  jsxElements.push(
                    <div
                      key={`${row}-${col}`}
                      className={`${item.bg || 'bg-blue-600'} flex items-center justify-center border`}
                      style={{
                        gridColumn: `span ${item.colSpan || 1}`,
                        gridRow: `span ${item.rowSpan || 1}`,
                        minHeight: 0,
                        minWidth: 0,
                      }}
                    >
                      <h3 className="text-white text-xs sm:text-sm md:text-lg font-bold text-center">
                        {item.content}
                      </h3>
                    </div>
                  );
                } else {
                  // For image type, use the actual grid position
                  jsxElements.push(
                    <div
                      key={`${row}-${col}`}
                      className="relative overflow-hidden bg-gray-200 border"
                      style={{
                        gridColumn: `span ${item.colSpan || 1}`,
                        gridRow: `span ${item.rowSpan || 1}`,
                        ...getImagePosition(row, col),
                      }}
                    />
                  );
                }
              }
            }
            
            return jsxElements;
          })()}
        </div>
      </div>
    </div>
  );
}

export default GridImagePuzzle;