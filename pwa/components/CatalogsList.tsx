import { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { ApiPlatformAdminState, ListGuesser, SchemaAnalyzer, SchemaAnalyzerContext } from "@api-platform/admin"

import CustomFieldGuesser from './CustomFieldGuesser';

export default function CatalogList(props) {
  // console.log('props =', props);
  const { resource } = props;

  const schemaAnalyzer = useContext<SchemaAnalyzer | null>(SchemaAnalyzerContext);
  const { resources } = useSelector((state: ApiPlatformAdminState) => {
    // console.log('state =', state);
    return state.introspect.introspect
      ? state.introspect.introspect.data
      : { resources: [] };
    }
  );

  const schema = resources.find(({ name }) => name === resource);
  // console.log('schema =', schema);

  const [orderParameters, setOrderParameters] = useState<string[]>([]);
  useEffect(() => {
    if (schema && schemaAnalyzer) {
      schemaAnalyzer.getOrderParametersFromSchema(schema).then((parameters) => {
        // console.log('parameters =', parameters);
        setOrderParameters(parameters);
      });
    }
  }, [schema, schemaAnalyzer]);

  let fields = [];
  if (schema) {
    fields = schema.readableFields.map(field => {
      const orderField = orderParameters.find(
        (orderParameter) => orderParameter.split('.')[0] === field.name,
      );
      return (
        <CustomFieldGuesser
          key={field.id}
          source={field.name}
          sortable={Boolean(orderField)}
          sortBy={orderField}
          field={field}
        />
      );
    })
  }

  return (
    <ListGuesser {...props}>
      {fields}
    </ListGuesser>
  );
};
