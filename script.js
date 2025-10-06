if (Model.SelectionCount === 0) {
  alert("Выбери хотя бы одну панель с пазами.");
} else {
  let totalLength = 0;
  let totalCount = 0;
  let debugInfo = "";

  function distance2D(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      const panel = obj;
      const cuts = panel.Cuts;

      if (cuts && cuts.Count > 0) {
        debugInfo += `Панель: ${panel.Name}\n=== Cuts (${cuts.Count}) ===\n`;
        for (let j = 0; j < cuts.Count; j++) {
          const cut = cuts[j];
          totalCount++;

          debugInfo += `[${j}] ${cut.Name}\n`;
          debugInfo += `Thickness: ${cut.Thickness}\n`;

          // Попробуем получить длину траектории
          let cutLength = 0;

          if (cut.Trajectory && cut.Trajectory.Objects && cut.Trajectory.Objects.Count > 0) {
            debugInfo += `Trajectory objects: ${cut.Trajectory.Objects.Count}\n`;
            for (let t = 0; t < cut.Trajectory.Objects.Count; t++) {
              const objT = cut.Trajectory.Objects[t];
              if (objT.Length && objT.Length > 0) {
                cutLength += objT.Length;
                debugInfo += `Trajectory[${t}] Length: ${objT.Length}\n`;
              } else if (objT.X1 !== undefined) {
                // вычисляем длину по координатам
                const len = distance2D(objT.X1, objT.Y1, objT.X2, objT.Y2);
                cutLength += len;
                debugInfo += `Trajectory[${t}] (координаты) длина: ${len}\n`;
              }
            }
          }

          // если траектории нет, попробуем через контур
          if (cutLength === 0 && cut.Contour && cut.Contour.Objects && cut.Contour.Objects.Count > 0) {
            debugInfo += `Contour objects: ${cut.Contour.Objects.Count}\n`;
            for (let c = 0; c < cut.Contour.Objects.Count; c++) {
              const objC = cut.Contour.Objects[c];
              if (objC.Length && objC.Length > 0) {
                cutLength += objC.Length;
                debugInfo += `Contour[${c}] Length: ${objC.Length}\n`;
              } else if (objC.X1 !== undefined) {
                const len = distance2D(objC.X1, objC.Y1, objC.X2, objC.Y2);
                cutLength += len;
                debugInfo += `Contour[${c}] (координаты) длина: ${len}\n`;
              } else if (objC.Width && objC.Width > 0) {
                cutLength += objC.Width;
                debugInfo += `Contour[${c}] Width: ${objC.Width}\n`;
              } else {
                debugInfo += `Contour[${c}] неизвестная структура: ${JSON.stringify(objC)}\n`;
              }
            }
          }

          totalLength += cutLength;
          debugInfo += `>>> Итог длины этого паза: ${cutLength}\n\n`;
        }
      }
    }
  }

  if (totalCount === 0) {
    alert("Пазы не найдены на выбранных панелях.");
  } else {
    alert(
      `🔹 Найдено пазов: ${totalCount}\n📏 Общая длина пазов: ${totalLength.toFixed(2)} мм\n\n=== DEBUG ===\n${debugInfo}`
    );
  }
}
