// Диагностика структуры панели в Bazis Script
// Определяет, где именно находятся пазы, вырезы и другие операции

if (Model.SelectionCount === 0) {
  alert("Выбери хотя бы одну панель в модели.");
} else {
  let foundPanel = false;

  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      foundPanel = true;
      const panel = obj;
      let info = "🔍 Диагностика панели '" + panel.Name + "'\n\n";

      info += "=== Основные свойства панели ===\n";
      for (let key in panel) {
        try {
          let val = panel[key];
          if (typeof val === "object") {
            if (val && typeof val.Count === "number") {
              info += `${key} = [object, Count=${val.Count}]\n`;
            } else {
              info += `${key} = [object]\n`;
            }
          } else {
            info += `${key} = ${val}\n`;
          }
        } catch (e) {
          info += `${key} = (ошибка чтения)\n`;
        }
      }

      // Проверим возможные коллекции, если есть
      const possibleCollections = [
        "Cuts", "PanelCuts", "Operations", "Features", "Contours", "Objects", "Children"
      ];

      info += "\n\n=== Проверка возможных коллекций ===\n";
      for (let name of possibleCollections) {
        try {
          const c = panel[name];
          if (c && typeof c.Count === "number") {
            info += `${name}: Count = ${c.Count}\n`;

            for (let j = 0; j < c.Count; j++) {
              const item = c[j];
              info += `  [${j}] тип = ${item.ClassName || "неизвестно"}\n`;

              // посмотрим ключевые поля
              for (let k in item) {
                try {
                  if (["Name", "Type", "Length", "Depth", "Width"].includes(k)) {
                    info += `    ${k} = ${item[k]}\n`;
                  }
                } catch {}
              }
            }
          } else {
            info += `${name}: нет или Count = 0\n`;
          }
        } catch (e) {
          info += `${name}: ошибка доступа\n`;
        }
      }

      // Сохраняем в файл
      system.askWriteTextFile("txt", info);
      alert("Файл с диагностикой панели сохранён.\nПришли его содержимое — я скажу, где находятся пазы.");
      break;
    }
  }

  if (!foundPanel) {
    alert("Выделенный объект не является панелью.");
  }
}
