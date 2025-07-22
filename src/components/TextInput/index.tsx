import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import React, { useMemo } from "react";
import clsx from "clsx";
import {FormInput} from "../../base-components/Form";

// @ts-ignore
function TextInput(props) {

  return (
      <>
        <div className="input-form">
          <FormInput
              {...props.register(props.name)}
              id="validation-form-1"
              type={(props.type)?props.type:'text'}
              // defaultValue={props.name}
              name={props.name}
              className={clsx('block px-4 py-3 intro-x min-w-full xl:min-w-[350px]',{
                "border-danger": props.errors[props.name],
              })}
              placeholder={props.placeholder}
          />
          {props.errors[props.name] && (
              <div className="mt-2 text-danger">
                {typeof props.errors[props.name].message === "string" &&
                    props.errors[props.name].message}
              </div>
          )}
        </div>
      </>
  )
}

export default TextInput;
