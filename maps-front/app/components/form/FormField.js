import React from "react";
import { useFormikContext } from "formik";
import TextInput from "../Input";
import ErrorMessage from "./ErrorMessage";

const AppFormField = React.forwardRef(({ name, width,onSubmitEditing,setRef, ...otherProps },ref) =>{
    const {
        setFieldTouched,
        setFieldValue,
        errors,
        touched,
        values,
    } = useFormikContext();

    return (
        <>
            <TextInput
                onBlur={() => setFieldTouched(name)}
                onChangeText={(text) => setFieldValue(name, text)}
                value={values[name]}
                width={width}
                setRef={setRef}
                {...otherProps}
                onSubmitEditing={onSubmitEditing}
            />
            <ErrorMessage error={errors[name]} visible={touched[name]}
                style={{ position: 'relative', bottom: 3 }}
            />
        </>
    );
})

export default AppFormField;