"""
Exemplos de uso do cliente FIPE
"""

from fipe_client import FipeClient, VehicleType


def exemplo_basico():
    """Exemplo básico de consultas à API FIPE"""
    
    # Inicializa o cliente (sem token - limite de 500 requisições/dia)
    client = FipeClient()
    
    # Ou com token (até 1000 requisições/dia)
    # client = FipeClient(subscription_token="seu_token_aqui")
    
    print("=== EXEMPLO 1: Listar Referências ===\n")
    references = client.get_references()
    print(f"Total de referências: {len(references)}")
    print(f"Última referência: {references[0] if references else 'N/A'}\n")
    
    print("=== EXEMPLO 2: Listar Marcas de Carros ===\n")
    brands = client.get_brands(VehicleType.CARS)
    print(f"Total de marcas: {len(brands)}")
    print("Primeiras 5 marcas:")
    for brand in brands[:5]:
        print(f"  - {brand['name']} (código: {brand['code']})")
    print()
    
    print("=== EXEMPLO 3: Listar Modelos de uma Marca ===\n")
    # VW - VolksWagen geralmente tem código 23
    models = client.get_models(VehicleType.CARS, brand_id=23)
    print(f"Total de modelos VW: {len(models)}")
    print("Primeiros 5 modelos:")
    for model in models[:5]:
        print(f"  - {model['name']} (código: {model['code']})")
    print()
    
    print("=== EXEMPLO 4: Listar Anos de um Modelo ===\n")
    if models:
        first_model_id = models[0]['code']
        years = client.get_years_by_model(
            VehicleType.CARS, 
            brand_id=23, 
            model_id=first_model_id
        )
        print(f"Anos disponíveis para o modelo {models[0]['name']}:")
        for year in years[:5]:
            print(f"  - {year['name']} (código: {year['code']})")
    print()
    
    print("=== EXEMPLO 5: Consultar Preço de um Veículo ===\n")
    # Exemplo usando código FIPE conhecido
    try:
        vehicle_details = client.get_vehicle_details(
            VehicleType.CARS,
            fipe_code="004278-1",
            year_id="2014-3"
        )
        print(f"Marca: {vehicle_details.get('brand')}")
        print(f"Modelo: {vehicle_details.get('model')}")
        print(f"Ano: {vehicle_details.get('modelYear')}")
        print(f"Combustível: {vehicle_details.get('fuel')}")
        print(f"Preço: {vehicle_details.get('price')}")
        print(f"Mês de referência: {vehicle_details.get('referenceMonth')}")
    except Exception as e:
        print(f"Erro ao consultar veículo: {e}")
    print()
    
    print("=== EXEMPLO 6: Histórico de Preços ===\n")
    try:
        history = client.get_vehicle_history(
            VehicleType.CARS,
            fipe_code="004278-1",
            year_id="2014-3"
        )
        print(f"Histórico de preços para {history.get('model')}:")
        price_history = history.get('priceHistory', [])
        for entry in price_history[:5]:  # Mostra últimos 5 registros
            print(f"  - {entry.get('month')}: {entry.get('price')}")
    except Exception as e:
        print(f"Erro ao consultar histórico: {e}")


def exemplo_consulta_completa():
    """Exemplo de busca completa: Marca -> Modelo -> Ano -> Preço"""
    
    client = FipeClient()
    
    print("\n=== BUSCA COMPLETA DE VEÍCULO ===\n")
    
    # 1. Buscar marcas
    print("1. Buscando marcas de carros...")
    brands = client.get_brands(VehicleType.CARS)
    
    # Encontrar uma marca específica (ex: Toyota)
    target_brand = next((b for b in brands if 'TOYOTA' in b['name'].upper()), None)
    if not target_brand:
        print("Marca Toyota não encontrada, usando primeira marca disponível")
        target_brand = brands[0]
    
    print(f"   Marca selecionada: {target_brand['name']} (ID: {target_brand['code']})\n")
    
    # 2. Buscar modelos da marca
    print(f"2. Buscando modelos de {target_brand['name']}...")
    models = client.get_models(VehicleType.CARS, brand_id=int(target_brand['code']))
    
    if not models:
        print("   Nenhum modelo encontrado")
        return
    
    target_model = models[0]
    print(f"   Modelo selecionado: {target_model['name']} (ID: {target_model['code']})\n")
    
    # 3. Buscar anos do modelo
    print(f"3. Buscando anos disponíveis para {target_model['name']}...")
    years = client.get_years_by_model(
        VehicleType.CARS,
        brand_id=int(target_brand['code']),
        model_id=int(target_model['code'])
    )
    
    if not years:
        print("   Nenhum ano encontrado")
        return
    
    target_year = years[0]
    print(f"   Ano selecionado: {target_year['name']} (ID: {target_year['code']})\n")
    
    # 4. Buscar detalhes do veículo
    print(f"4. Consultando preço do veículo...")
    try:
        # Para obter o código FIPE, precisamos primeiro obter os detalhes
        # Vamos usar o código do modelo como referência
        # Nota: Na prática, você precisaria ter o código FIPE ou fazer uma busca diferente
        print("   (Nota: Para obter o preço, é necessário o código FIPE)")
        print("   (Use get_vehicle_details com o código FIPE conhecido)")
    except Exception as e:
        print(f"   Erro: {e}")


def exemplo_motos():
    """Exemplo consultando motos"""
    
    client = FipeClient()
    
    print("\n=== CONSULTA DE MOTOS ===\n")
    
    brands = client.get_brands(VehicleType.MOTORCYCLES)
    print(f"Total de marcas de motos: {len(brands)}")
    print("Primeiras 10 marcas:")
    for brand in brands[:10]:
        print(f"  - {brand['name']}")


def exemplo_caminhoes():
    """Exemplo consultando caminhões"""
    
    client = FipeClient()
    
    print("\n=== CONSULTA DE CAMINHÕES ===\n")
    
    brands = client.get_brands(VehicleType.TRUCKS)
    print(f"Total de marcas de caminhões: {len(brands)}")
    print("Primeiras 10 marcas:")
    for brand in brands[:10]:
        print(f"  - {brand['name']}")


if __name__ == "__main__":
    # Executa os exemplos
    exemplo_basico()
    exemplo_consulta_completa()
    exemplo_motos()
    exemplo_caminhoes()
