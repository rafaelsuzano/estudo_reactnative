import { createDrawerNavigator } from '@react-navigation/drawer';

import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ConsultaCNPJ from '../screens/Cadastro/ConsultaCnpj';
import ConsultaVeiculo from '../screens/Veiculo/ConsultaVeiculo';
import ConsultaPlaca from '../screens/Veiculo/ConsultaPlaca';

const Drawer = createDrawerNavigator();

export default function DrawerNavigator({ route }) {
  const { usuario } = route.params || {};

  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="Home"
        component={HomeScreen}
        initialParams={{ usuario }}
      />

      <Drawer.Screen
        name="Consulta Ordem de Serviço"
        component={ProfileScreen}
      />

      <Drawer.Screen
        name="Consulta CNPJ"
        component={ConsultaCNPJ}
      />

<Drawer.Screen
        name="Consulta Veiculo"
        component={ConsultaVeiculo}
      />

      <Drawer.Screen
        name="Consulta Placa (API)"
        component={ConsultaPlaca}
      />






    </Drawer.Navigator>



  );
}
