// Скрипт подсчёта длины всех пазов (вырезов, cuts) на панели
// Работает с элементами, созданными через panelOperations.AddCut()

let totalLength = 0;
let totalCuts = 0;

// Функция вычисления длины одного паза по траектории
function getCutLength(cut) {
  if (!cut.Trajectory || cut.Trajectory.Objects.Count === 0) return 0;

  let length = 0;
  for (let i = 0; i < cut.Trajectory.Objects.Count; i++) {
    const obj = cut.Trajectory.Objects[i];

    if (obj instanceof TLine3D) {
      // Прямая линия
      const dx = obj.P2.x - obj.P1.x;
      const dy = obj.P2.y - obj.P1.y;
      const dz = obj.P2.z - obj.P1.z;
      length += Math.sqrt(dx * dx + dy * dy + dz * dz);
    } else if (obj instanceof TArc3D) {
      // Дуга
      length += Math.abs(obj.Radius * obj.Angle);
    } else {
      // Другие типы элементов (например, сплайны)
      try {
        length += obj.Length;
      } catch (e) {
        // Пропускаем, если нет свойства Length
      }
    }
  }
  return length;
}

// Функция обработки панели
function processPanel(panel) {
  if (!panel.Cuts || panel.Cuts.Count === 0) return;

  for (let i = 0; i < panel.Cuts.Count; i++) {
    const cut = panel.Cuts[i];
    const len = getCutLength(cut);
    totalLength += len;
    totalCuts++;
  }
}

// Проверяем, выбраны ли панели
if (Model.SelectionCount > 0) {
  for (let i = 0; i < Model.SelectionCount; i++) {
    const obj = Model.Selections[i];
    if (obj instanceof TFurnPanel) {
      processPanel(obj);
    } else if (obj.AsList) {
      searchInList(obj);
    }
  }
} else {
  // Если не выбрано — обрабатываем все панели в модели
  Model.forEachPanel(panel => processPanel(panel));
}

// Рекурсивный поиск панелей в группе
function searchInList(list) {
  for (let i = 0; i < list.Count; i++) {
    const obj = list[i];
    if (obj instanceof TFurnPanel) {
      processPanel(obj);
    } else if (obj.AsList) {
      searchInList(obj);
    }
  }
}

// Вывод результата
if (totalCuts > 0) {
  alert(`Найдено пазов: ${totalCuts}\nОбщая длина: ${totalLength.toFixed(2)} мм`);
} else {
  alert("Пазы (вырезы) не найдены. Убедитесь, что на панели есть операции AddCut().");
}
