import { ComponentMeta, ComponentStory } from '@storybook/react'
import AppBar from './AppBar'

export default {
  title: 'Molecules/AppBar',
  component: AppBar,
} as ComponentMeta<typeof AppBar>

const slug = ['search', 'configuration', 'autocompletion']

const menu = {
  hierarchy: [
    {
      code: 'dashboard',
      label: 'Dashboard',
      order: 10,
    },
    {
      code: 'analyze',
      label: 'Analyze',
      order: 20,
      children: [
        {
          code: 'analyze_catalog_structure',
          label: 'Catalog structure',
          order: 10,
        },
        {
          code: 'analyze_search_usage',
          label: 'Search usage',
          order: 20,
        },
        {
          code: 'analyze_ab_testing',
          label: 'A/B testing',
          order: 30,
        },
      ],
    },
    {
      code: 'merchandize',
      label: 'Merchandize',
      order: 30,
      children: [
        {
          code: 'merchandize_categories',
          label: 'Categories',
          order: 10,
        },
        {
          code: 'merchandize_search_results',
          label: 'Search results',
          order: 20,
        },
        {
          code: 'merchandize_recommender',
          label: 'Recommenders',
          order: 30,
          children: [
            {
              code: 'merchandize_recommender_configuration',
              label: 'General configuration',
              order: 10,
            },
            {
              code: 'merchandize_recommender_manual_recommenders',
              label: 'Manual recommenders',
              order: 20,
            },
            {
              code: 'merchandize_recommender_auto_recommenders',
              label: 'Auto recommenders',
              order: 30,
            },
            {
              code: 'merchandize_recommender_behavioral_recommenders',
              label: 'Behavioral recommenders',
              order: 30,
            },
          ],
        },
        {
          code: 'merchandize_recommender_boosts',
          label: 'Boosts',
          order: 40,
        },
      ],
    },
    {
      code: 'search',
      label: 'Search',
      order: 40,
      children: [
        {
          code: 'search_configuration',
          label: 'Configuration',
          order: 10,
          children: [
            {
              code: 'search_configuration_relevance',
              label: 'Relevance',
              order: 10,
            },
            {
              code: 'search_configuration_autocompletion',
              label: 'Autocompletion',
              order: 20,
            },
            {
              code: 'search_configuration_attributes',
              label: 'Attributes',
              order: 30,
            },
          ],
        },
        {
          code: 'search_facets',
          label: 'Facets',
          order: 20,
        },
        {
          code: 'search_thesasurus',
          label: 'Thesaurus',
          order: 30,
        },
      ],
    },
    {
      code: 'monitoring',
      label: 'Monitoring',
      order: 50,
      children: [
        {
          code: 'monitoring_index',
          label: 'Index',
          order: 10,
        },
        {
          code: 'monitoring_imports',
          label: 'Imports',
          order: 20,
        },
      ],
    },
    {
      code: 'settings',
      label: 'Settings',
      order: 100,
      children: [
        {
          code: 'settings_global_configuration',
          label: 'Global configuration',
          order: 10,
        },
        {
          code: 'catalog',
          label: 'Catalog',
          order: 15,
          children: [
            {
              code: 'catalog_catalogs_and_locales',
              label: 'Catalogs and locales',
              order: 10,
            },
            {
              code: 'catalog_attributes_configuration',
              label: 'Attributes configuration',
              order: 20,
            },
          ],
        },
        {
          code: 'settings_data_collection',
          label: 'Data collection',
          order: 20,
          children: [
            {
              code: 'settings_data_collection_behavioral_data_configuration',
              label: 'Behavioral data configuration',
              order: 10,
            },
            {
              code: 'settings_data_collection_tracking',
              label: 'Tracking',
              order: 20,
            },
            {
              code: 'settings_data_collection_telemetry_beacon',
              label: 'Telemetry and Beacon',
              order: 30,
            },
          ],
        },
        {
          code: 'settings_interfaces',
          label: 'Interfaces',
          order: 100,
        },
        {
          code: 'users',
          label: 'Users',
          order: 110,
        },
      ],
    },
  ],
}

function NewSlug(data: string[]) {
  let newBreadCrumbData = [data[0]]
  for (let index = 0; index < data.length - 1; index++) {
    newBreadCrumbData = [
      ...newBreadCrumbData,
      [newBreadCrumbData.pop()].concat(data[index + 1]).join('_'),
    ]
  }
  return newBreadCrumbData
}

const Template: ComponentStory<typeof AppBar> = (args) => <AppBar {...args} />

export const Default = Template.bind({})
Default.args = {
  stories: true,
  slug: NewSlug(slug),
  menu: menu,
}
