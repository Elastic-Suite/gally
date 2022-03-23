import { useSelector } from 'react-redux';
import { ApiPlatformAdminState, EditGuesser } from "@api-platform/admin"


import CustomInputGuesser from "./CustomInputGuesser";

export default function CatalogEdit(props) {
  // console.log('props =', props);
  const { resource } = props;

  const { resources } = useSelector((state: ApiPlatformAdminState) => {
    // console.log('state =', state);
    return state.introspect.introspect
      ? state.introspect.introspect.data
      : { resources: [] };
    }
  );

  const schema = resources.find(({ name }) => name === resource);
  // console.log('schema =', schema);

  let fields = [];
  if (schema) {
    fields = schema.readableFields.map(field => <CustomInputGuesser key={field.id} source={field.name} field={field} />)
  }

  function transform(data) {
    console.log('transform', data)
    return data;
  }

  return (
    <EditGuesser {...props} transform={transform}>
      {fields}
    </EditGuesser>
  );
}
