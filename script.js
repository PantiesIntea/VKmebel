let totalWidth = 0;
let totalCuts = 0;
let debug = "";

// === Рекурсивный поиск панелей ===
function searchPanels(obj) {
  if (!obj) return;

  if (obj instanceof TFurnPanel) {
    processPanel(obj);
  } else if (obj.AsList) {
    for (let i = 0; i < obj.Count; i++) {
      searchPanels(obj[i]);
    }
  }
}

// === Обработка панели ===
function processPanel(panel) {
  const cuts = panel.Cuts;
  if (!cuts || cuts.Count === 0) return;

  for (let i = 0; i < cuts.Count; i++) {
    const cut = cuts[i];
    let cutWidth = 0;

    if (cut.Contour && cut.Contour.Objects && cut.Contour.Objects.Count > 0) {
      for (let j = 0; j < cut.Contour.Objects.Count; j++) {
        const obj = cut.Contour.Objects[j];
        if (obj.Width && obj.Width > 0) {
          cutWidth += obj.Width;
        }
      }
    }

    if (cutWidth > 0) {
      totalCuts++;
      totalWidth += cutWidth;
      debug += `Панель: ${panel.Name}\nПаз: ${cut.Name}\nШирина: ${cutWidth.toFixed(2)} мм\n\n`;
    }
  }
}

// === Основной цикл ===
if (Model.SelectionCount > 0) {
  for (let i = 0; i < Model.SelectionCount; i++) {
    const sel = Model.Selections[i];
    if (sel instanceof TFurnPanel) {
      processPanel(sel);
    } else if (sel.AsList) {
      searchPanels(sel);
    }
  }
} else {
  // если ничего не выделено — считаем по всей модели
  Model.forEachPanel(panel => processPanel(panel));
}

// === Результат ===
if (totalCuts === 0) {
  alert("❌ Пазы (вырезы) не найдены. Убедись, что на панели есть AddCut().");
} else {
  alert(`✅ Найдено пазов: ${totalCuts}\n📏 Общая длина (ширина) пазов: ${totalWidth.toFixed(2)} мм\n\n${debug}`);
}
