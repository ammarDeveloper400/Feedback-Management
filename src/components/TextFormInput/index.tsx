import Chart from "../../base-components/Chart";
import { ChartData, ChartOptions } from "chart.js/auto";
import { getColor } from "../../utils/colors";
import { selectColorScheme } from "../../stores/colorSchemeSlice";
import { selectDarkMode } from "../../stores/darkModeSlice";
import { useAppSelector } from "../../stores/hooks";
import React, { useMemo } from "react";
import clsx from "clsx";
import {FormInput, FormLabel} from "../../base-components/Form";

// @ts-ignore
function TextFormInput(props) {

  return (
      <>
          <div className="mt-3">
              <FormLabel htmlFor="update-profile-form-4">
                  {props.placeholder}
              </FormLabel>
              <div className="input-form">
                  <FormInput
                      disabled={props.disabled}
                      id="validation-form-1"
                      type={props.type}
                      name={props.name}
                      className={clsx('block px-4 py-3 intro-x min-w-full xl:min-w-[350px]',{
                          "border-danger": props.formik.errors[props.name],
                      })}
                      placeholder={props.placeholder}
                      onChange={props.formik.handleChange}
                      onBlur={props.formik.handleBlur}
                      value={props.formik.values[props.name]}
                  />
                  {props.formik.errors[props.name] && (
                      <div className="mt-2 text-danger">
                          {props.formik.errors[props.name]}
                      </div>
                  )}
              </div>

          </div>
      </>
  )
}

export default TextFormInput;
