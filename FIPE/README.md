# Cliente Python para API FIPE

Cliente Python para consultar a [API FIPE v2](https://deividfortuna.github.io/fipe/v2/), que fornece preços médios de veículos no mercado nacional.

## Instalação

```bash
pip install -r requirements.txt
```

## Uso Básico

### Importar o cliente

```python
from fipe_client import FipeClient, VehicleType

# Criar cliente sem token (limite: 500 requisições/dia)
client = FipeClient()

# Ou com token (limite: 1000 requisições/dia)
# client = FipeClient(subscription_token="seu_token_aqui")
```

### Consultas Disponíveis

#### 1. Listar Referências (Meses disponíveis)

```python
references = client.get_references()
print(references)
# [{"code": "308", "month": "abril de 2024"}, ...]
```

#### 2. Listar Marcas por Tipo de Veículo

```python
# Carros
brands = client.get_brands(VehicleType.CARS)

# Motos
brands = client.get_brands(VehicleType.MOTORCYCLES)

# Caminhões
brands = client.get_brands(VehicleType.TRUCKS)

# Com referência específica
brands = client.get_brands(VehicleType.CARS, reference=308)
```

#### 3. Listar Modelos por Marca

```python
models = client.get_models(
    vehicle_type=VehicleType.CARS,
    brand_id=23  # ID da marca (ex: VW = 23)
)
```

#### 4. Listar Anos por Modelo

```python
years = client.get_years_by_model(
    vehicle_type=VehicleType.CARS,
    brand_id=23,
    model_id=5580
)
# [{"code": "2022-3", "name": "2022 Diesel"}, ...]
```

#### 5. Consultar Preço do Veículo

```python
details = client.get_vehicle_details(
    vehicle_type=VehicleType.CARS,
    fipe_code="004278-1",  # Código FIPE
    year_id="2014-3"       # ID do ano
)

print(details['price'])  # "R$ 10.000,00"
print(details['model'])  # Nome do modelo
print(details['brand'])  # Nome da marca
```

#### 6. Consultar Histórico de Preços

```python
history = client.get_vehicle_history(
    vehicle_type=VehicleType.CARS,
    fipe_code="004278-1",
    year_id="2014-3"
)

for entry in history['priceHistory']:
    print(f"{entry['month']}: {entry['price']}")
```

## Funções de Conveniência

Também é possível usar funções diretas sem instanciar o cliente:

```python
from fipe_client import get_references, get_brands, get_vehicle_price, VehicleType

# Listar referências
references = get_references()

# Listar marcas
brands = get_brands(VehicleType.CARS)

# Consultar preço
price_info = get_vehicle_price(
    VehicleType.CARS,
    fipe_code="004278-1",
    year_id="2014-3"
)
```

## Exemplos

Veja o arquivo `exemplo_uso.py` para exemplos completos de uso:

```bash
python exemplo_uso.py
```

## Limites da API

- **Sem token**: 500 requisições por dia (24h)
- **Com token gratuito**: 1000 requisições por dia (24h)
  - Obter token em: https://fipe.online
- **Plano pago**: Requisições ilimitadas + histórico completo

## Tipos de Veículos

A API suporta três tipos de veículos:

- `VehicleType.CARS` - Carros
- `VehicleType.MOTORCYCLES` - Motocicletas
- `VehicleType.TRUCKS` - Caminhões

## Tratamento de Erros

O cliente levanta exceções em caso de erro:

```python
try:
    details = client.get_vehicle_details(...)
except Exception as e:
    print(f"Erro: {e}")
```

## Documentação Completa da API

Para mais detalhes sobre os endpoints, consulte:
https://deividfortuna.github.io/fipe/v2/

## Estrutura de Respostas

### Referências
```json
[{"code": "308", "month": "abril de 2024"}]
```

### Marcas
```json
[{"code": "23", "name": "VW - VolksWagen"}]
```

### Modelos
```json
[{"code": "5580", "name": "AMAROK High.CD 2.0 16V TDI 4x4 Dies. Aut"}]
```

### Detalhes do Veículo
```json
{
  "brand": "VW - VolksWagen",
  "codeFipe": "005340-6",
  "fuel": "Diesel",
  "model": "AMAROK High.CD 2.0 16V TDI 4x4 Dies. Aut",
  "modelYear": 2014,
  "price": "R$ 10.000,00",
  "referenceMonth": "abril de 2024",
  "priceHistory": [...]
}
```
