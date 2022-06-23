import React from 'react'
import { ComponentStory, ComponentMeta } from '@storybook/react'
import CustomTabs from '~/components/molecules/layout/tabs/CustomTabs'
import SubTabs from '~/components/atoms/subTabs/SubTabs'
import TertiaryButton from '~/components/atoms/buttons/TertiaryButton'
import IonIcon from '~/components/atoms/IonIcon/IonIcon'

export default {
  title: 'Molecules/TabsAndSubTabs',
  component: CustomTabs,
} as ComponentMeta<typeof CustomTabs>

const Template: ComponentStory<typeof CustomTabs> = (args) => (
  <CustomTabs {...args} />
)

export const Default = Template.bind({})
Default.args = {
  labels: ['Scope', 'Searchable and filtrable attributes'],
  contents: [
    <SubTabs
      labels={[
        'Catalogs',
        'Actives locales',
        'Actives locales 1',
        'Actives locales 2',
      ]}
      contents={[
        <TertiaryButton
          size="medium"
          endIcon={<IonIcon name="add-outline" style={{ fontSize: 24 }} />}
        >
          Button text
        </TertiaryButton>,
        'Hello World Deux',
        'Hello World Trois',
        'Hello World Quatre',
      ]}
    />,
    'Content of Searchable and filtrable attributes',
  ],
}
