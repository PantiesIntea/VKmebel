// Скрипт для диагностики пазов панели в БАЗИС
// Определяет свойства первого найденного паза, чтобы понять, как считать длину

if (Model.SelectionCount === 0) {
  alert("Выбери хотя бы одну панель.");
} else {
  let found = false;

  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];

    if (obj instanceof TFurnPanel) {
      const panel = obj;

      if (panel.Cuts && panel.Cuts.Count > 0) {
        found = true;
        const cut = panel.Cuts[0];

        let info = "🔍 Информация о первом пазе панели '" + panel.Name + "'\n\n";
        info += "Тип объекта: " + (cut.ClassName || "неизвестно") + "\n";
        info += "Всего пазов на панели: " + panel.Cuts.Count + "\n\n";

        // Основные свойства
        info += "=== Основные свойства Cut ===\n";
        for (let key in cut) {
          try {
            let value = cut[key];
            if (typeof value === "object") value = "[object]";
            info += key + " = " + value + "\n";
          } catch (e) {
            info += key + " = (ошибка при чтении)\n";
          }
        }

        // Проверим Trajectory
        if (cut.Trajectory) {
          info += "\n=== Trajectory ===\n";
          try {
            info += "Trajectory.Length = " + cut.Trajectory.Length + "\n";
            info += "Trajectory.Objects.Count = " + (cut.Trajectory.Objects ? cut.Trajectory.Objects.Count : 0) + "\n";
          } catch (e) {
            info += "Ошибка при чтении Trajectory\n";
          }

          if (cut.Trajectory.Objects && cut.Trajectory.Objects.Count > 0) {
            info += "\n--- Trajectory.Objects ---\n";
            for (let i = 0; i < cut.Trajectory.Objects.Count; i++) {
              let obj = cut.Trajectory.Objects[i];
              info += "[" + i + "] тип: " + (obj.ClassName || "неизвестно") + "\n";
              for (let k in obj) {
                try {
                  let v = obj[k];
                  if (typeof v === "object") v = "[object]";
                  info += "  " + k + " = " + v + "\n";
                } catch (e) {
                  info += "  " + k + " = (ошибка)\n";
                }
              }
              info += "\n";
            }
          }
        } else {
          info += "\nTrajectory отсутствует\n";
        }

        // Проверим Contour
        if (cut.Contour) {
          info += "\n=== Contour ===\n";
          try {
            info += "Contour.Objects.Count = " + (cut.Contour.Objects ? cut.Contour.Objects.Count : 0) + "\n";
          } catch (e) {
            info += "Ошибка при чтении Contour\n";
          }

          if (cut.Contour.Objects && cut.Contour.Objects.Count > 0) {
            info += "\n--- Contour.Objects ---\n";
            for (let i = 0; i < cut.Contour.Objects.Count; i++) {
              let obj = cut.Contour.Objects[i];
              info += "[" + i + "] тип: " + (obj.ClassName || "неизвестно") + "\n";
              for (let k in obj) {
                try {
                  let v = obj[k];
                  if (typeof v === "object") v = "[object]";
                  info += "  " + k + " = " + v + "\n";
                } catch (e) {
                  info += "  " + k + " = (ошибка)\n";
                }
              }
              info += "\n";
            }
          }
        } else {
          info += "\nContour отсутствует\n";
        }

        // Сохраняем в файл (чтобы не обрезало alert)
        system.askWriteTextFile("txt", info);
        alert("Файл с данными о пазе сохранён.\nПришли мне его содержимое — я скажу, как считать длину.");
        break;
      }
    }
  }

  if (!found) {
    alert("Панель выбрана, но пазы (Cuts) не найдены.");
  }
}
