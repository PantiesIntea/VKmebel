if (Model.SelectionCount === 0) {
  alert("Выбери хотя бы одну панель с пазами.");
} else {
  let totalLength = 0;
  let totalCount = 0;

  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      const panel = obj;

      const cuts = panel.Cuts;
      if (cuts && cuts.Count > 0) {
        for (let j = 0; j < cuts.Count; j++) {
          const cut = cuts[j];
          totalCount++;

          // Проверяем контур паза
          if (cut.Contour && cut.Contour.Objects && cut.Contour.Objects.Count > 0) {
            for (let k = 0; k < cut.Contour.Objects.Count; k++) {
              const line = cut.Contour.Objects[k];
              try {
                if (line.Length && line.Length > 0) {
                  totalLength += line.Length;
                } else if (line.Width && line.Width > 0) {
                  totalLength += line.Width;
                }
              } catch {}
            }
          }
          // если нет контура — пробуем взять ширину или длину напрямую
          else if (cut.Width && cut.Width > 0) {
            totalLength += cut.Width;
          } else if (cut.Length && cut.Length > 0) {
            totalLength += cut.Length;
          }
        }
      }
    }
  }

  if (totalCount === 0) {
    alert("Пазы не найдены на выбранных панелях.");
  } else {
    alert(
      "🔹 Найдено пазов: " + totalCount + "\n" +
      "📏 Общая длина пазов: " + totalLength.toFixed(2) + " мм"
    );
  }
}
