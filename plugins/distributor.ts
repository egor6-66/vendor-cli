import { container } from 'webpack'; 
 
const configs = [
{
  name: 'components',
  filename: 'remote_components_v1.js',
  exposes: { './button': './src/components/button.tsx' }
},
]
 
export const chunks = [ 'components' ]
export default configs.map((config) => new container.ModuleFederationPlugin(config));