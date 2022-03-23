import { useContext } from 'react';
import { FieldGuesser, SchemaAnalyzer, SchemaAnalyzerContext } from "@api-platform/admin"

export default function CustomFieldGuesser(props) {
  const { field, ...restProps } = props
  // console.log(field.reference);

  const schemaAnalyzer = useContext<SchemaAnalyzer | null>(SchemaAnalyzerContext);
  const fieldType = schemaAnalyzer.getFieldType(field);
  // console.log('fieldType =', fieldType);

  return (<FieldGuesser {...restProps} />);
}
