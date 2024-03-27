import React, { memo, useCallback, useState } from "react";
import cls from "./App.module.css";

type AvailableTypes = "string";

interface Param {
  id: number;
  name: string;
  type: AvailableTypes;
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Model {
  paramValues: ParamValue[];
}

interface ParamEditorProps {
  params: Param[];
  model: Model;
}

interface StringParamProps {
  param: Param;
  paramValue?: ParamValue;
  onChange?: (value: string) => void;
}

// Компонента для вывода параметра с type string
const StringParam = memo((props: StringParamProps) => {
  const { param, paramValue, onChange } = props;

  const onChangeHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  return (
    <div className={cls["param-container"]}>
      <p>{param.name}</p>
      <input onChange={onChangeHandler} type="text" value={paramValue?.value} />
    </div>
  );
});

// Основная компонента ParamEditor, которая отображает параметры модели
const ParamEditor = (props: ParamEditorProps) => {
  const { params } = props;
  // состояние для хранения модели
  const [model, setModel] = useState(props.model);

  // функция getModel для получения модели
  const getModel = useCallback(() => {
    return model;
  }, [model]);

  // Функция, которая генерирует onChange обработчик для параметра с типом string
  const generateStringParamOnChangeHandler =
    ({ param }: { param: Param }) =>
    (value: string) => {
      setModel((prevModel) => {
        const updatedParamValues = prevModel.paramValues.map((paramValue) => {
          if (paramValue.paramId === param.id) {
            return { ...paramValue, value };
          }
          return paramValue;
        });
        return { ...prevModel, paramValues: updatedParamValues };
      });
    };

  // Функция, которая рендерит параметры модели в зависимости от типа параметра
  const renderParam = useCallback(
    (param: Param) => {
      switch (param.type) {
        case "string": {
          // Находим значение для параметра; используем find, так как знаем,
          // что у параметра типа string 1 значение
          const paramValue = model.paramValues.find(
            (pv) => pv.paramId === param.id
          );
          return (
            <StringParam
              param={param}
              onChange={generateStringParamOnChangeHandler({ param })}
              paramValue={paramValue}
            />
          );
        }
        default: {
          return `Неизвестный тип параметра "${param.type}" | ${param.name}`;
        }
      }
    },
    [model.paramValues]
  );

  return <div className={cls["model"]}>{params.map(renderParam)}</div>;
};

// Стартовая функция с моковыми параметрами и моделью
function App() {
  const params: Param[] = [
    {
      id: 1,
      name: "Назначение",
      type: "string",
    },
    {
      id: 2,
      name: "Длина",
      type: "string",
    },
    {
      id: 3,
      name: "Ширина",
      type: "string",
    },
  ];

  const initialModel: Model = {
    paramValues: [
      {
        paramId: 1,
        value: "повседневное",
      },
      {
        paramId: 2,
        value: "макси",
      },
      {
        paramId: 3,
        value: "максимум",
      },
    ],
  };

  return (
    <div className={cls["page"]}>
      <ParamEditor model={initialModel} params={params} />
    </div>
  );
}

export default App;
