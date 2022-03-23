import { useContext } from 'react';
import { InputGuesser, SchemaAnalyzer, SchemaAnalyzerContext } from "@api-platform/admin"
import { AutocompleteArrayInput, getFieldLabelTranslationArgs, ReferenceArrayInput, ReferenceArrayInputProps, required, SelectArrayInput, useTranslate } from "react-admin"
// import Autocomplete from '@mui/material/Autocomplete';
// import TextField from '@mui/material/TextField';

export default function CustomInputGuesser(props) {
  const { field, validate } = props;
  const schemaAnalyzer = useContext<SchemaAnalyzer | null>(SchemaAnalyzerContext);
  const translate = useTranslate();

  if (field.reference !== null && typeof field.reference === 'object') {
    if (field.maxCardinality !== 1) {
      const translatedLabel = translate(
        ...getFieldLabelTranslationArgs({
          resource: props.resource,
          source: field.name,
        }),
      );

      const guessedValidate = !validate && field.required ? [required()] : validate;

      return (
        <ReferenceArrayInput
          key={field.name}
          label={translatedLabel}
          validate={guessedValidate}
          {...(props as ReferenceArrayInputProps)}
          reference={field.reference.name}
          source={field.name}
          allowEmpty
        >
          <AutocompleteArrayInput
            optionText={schemaAnalyzer.getFieldNameFromSchema(field.reference)}
          />
        </ReferenceArrayInput>
      );
    }
  }

  return (<InputGuesser {...props} />);
}
