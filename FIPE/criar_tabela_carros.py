"""
Script para criar tabela com dados de carros da API FIPE
"""

from fipe_client import FipeClient, VehicleType
import pandas as pd
from typing import List, Optional


def criar_tabela_marcas_modelos_anos(
    client: FipeClient,
    limite_marcas: int = 5,
    limite_modelos_por_marca: int = 3,
    limite_anos_por_modelo: int = 2
) -> pd.DataFrame:
    """
    Cria uma tabela com marcas, modelos e anos disponíveis
    
    Args:
        client: Cliente FIPE
        limite_marcas: Número máximo de marcas a processar
        limite_modelos_por_marca: Número máximo de modelos por marca
        limite_anos_por_modelo: Número máximo de anos por modelo
        
    Returns:
        DataFrame com marca, modelo e anos disponíveis
    """
    dados = []
    
    print("Buscando marcas, modelos e anos...")
    brands = client.get_brands(VehicleType.CARS)
    
    for brand in brands[:limite_marcas]:
        brand_code = int(brand['code'])
        brand_name = brand['name']
        
        try:
            print(f"Processando {brand_name}...")
            models = client.get_models(VehicleType.CARS, brand_code)
            
            for model in models[:limite_modelos_por_marca]:
                model_code = int(model['code'])
                model_name = model['name']
                
                try:
                    years = client.get_years_by_model(
                        VehicleType.CARS,
                        brand_code,
                        model_code
                    )
                    
                    anos_disponiveis = [y['name'] for y in years[:limite_anos_por_modelo]]
                    anos_codigos = [y['code'] for y in years[:limite_anos_por_modelo]]
                    
                    dados.append({
                        'Marca': brand_name,
                        'Modelo': model_name,
                        'Código Marca': brand_code,
                        'Código Modelo': model_code,
                        'Anos Disponíveis': ', '.join(anos_disponiveis),
                        'Códigos Anos': ', '.join(anos_codigos)
                    })
                    
                except Exception as e:
                    print(f"  Erro ao buscar anos do modelo {model_name}: {e}")
                    dados.append({
                        'Marca': brand_name,
                        'Modelo': model_name,
                        'Código Marca': brand_code,
                        'Código Modelo': model_code,
                        'Anos Disponíveis': 'Erro ao buscar',
                        'Códigos Anos': ''
                    })
                    continue
                    
        except Exception as e:
            print(f"Erro ao processar marca {brand_name}: {e}")
            continue
    
    return pd.DataFrame(dados)


def criar_tabela_simples(client: FipeClient, limite: int = 20) -> pd.DataFrame:
    """
    Cria uma tabela simples com marcas e modelos (sem preços)
    Mais rápido e não excede limites de requisições
    
    Args:
        client: Cliente FIPE
        limite: Número máximo de registros
        
    Returns:
        DataFrame com marcas e modelos
    """
    dados = []
    
    print("Buscando marcas e modelos...")
    brands = client.get_brands(VehicleType.CARS)
    
    for brand in brands[:10]:  # Limitar a 10 marcas
        brand_code = int(brand['code'])
        brand_name = brand['name']
        
        try:
            models = client.get_models(VehicleType.CARS, brand_code)
            
            for model in models[:limite//10]:  # Distribuir limite entre marcas
                dados.append({
                    'Marca': brand_name,
                    'Modelo': model['name'],
                    'Código Marca': brand_code,
                    'Código Modelo': model['code']
                })
                
                if len(dados) >= limite:
                    break
                    
        except Exception as e:
            print(f"Erro ao buscar modelos de {brand_name}: {e}")
            continue
        
        if len(dados) >= limite:
            break
    
    return pd.DataFrame(dados)


def criar_tabela_todos_precos(
    client: FipeClient,
    limite_marcas: Optional[int] = None,
    limite_modelos_por_marca: Optional[int] = None,
    limite_anos_por_modelo: Optional[int] = None,
    max_requisicoes: Optional[int] = None
) -> pd.DataFrame:
    """
    Cria tabela com preços de carros buscando através de marcas, modelos e anos
    
    Args:
        client: Cliente FIPE
        limite_marcas: Número máximo de marcas a processar (None = sem limite)
        limite_modelos_por_marca: Número máximo de modelos por marca (None = sem limite)
        limite_anos_por_modelo: Número máximo de anos por modelo (None = sem limite)
        max_requisicoes: Limite máximo de requisições (None = sem limite, use com cuidado!)
        
    Returns:
        DataFrame com dados dos carros e preços
    """
    dados = []
    
    if limite_marcas is None:
        print("Buscando preços de TODOS os carros (SEM LIMITE)...")
    else:
        print(f"Buscando preços de carros (limite: {limite_marcas} marcas)...")
    
    brands = client.get_brands(VehicleType.CARS)
    total_brands = len(brands) if limite_marcas is None else min(limite_marcas, len(brands))
    
    total_requisicoes = 0
    if max_requisicoes is None:
        # Se não há limite de requisições, usar um número muito alto como segurança
        max_requisicoes = 999999
    
    brands_to_process = brands if limite_marcas is None else brands[:limite_marcas]
    
    for idx, brand in enumerate(brands_to_process, 1):
        if total_requisicoes >= max_requisicoes:
            print(f"\nLimite de requisições atingido ({max_requisicoes})")
            break
            
        brand_code = int(brand['code'])
        brand_name = brand['name']
        total_requisicoes += 1
        
        try:
            print(f"\n[{idx}/{total_brands}] Processando {brand_name}...")
            models = client.get_models(VehicleType.CARS, brand_code)
            total_requisicoes += 1
            
            models_to_process = models if limite_modelos_por_marca is None else models[:limite_modelos_por_marca]
            
            for model_idx, model in enumerate(models_to_process, 1):
                if total_requisicoes >= max_requisicoes:
                    break
                    
                model_code = int(model['code'])
                model_name = model['name']
                
                try:
                    years = client.get_years_by_model(
                        VehicleType.CARS,
                        brand_code,
                        model_code
                    )
                    total_requisicoes += 1
                    
                    years_to_process = years if limite_anos_por_modelo is None else years[:limite_anos_por_modelo]
                    
                    for year in years_to_process:
                        if total_requisicoes >= max_requisicoes:
                            break
                            
                        year_code = year['code']
                        year_name = year['name']
                        
                        # Tentar obter modelos por marca e ano para descobrir código FIPE
                        try:
                            models_by_year = client.get_models_by_brand_and_year(
                                VehicleType.CARS,
                                brand_code,
                                year_code
                            )
                            total_requisicoes += 1
                            
                            # Procurar nosso modelo na lista
                            for model_by_year in models_by_year:
                                if model_by_year.get('code') == model_code:
                                    # Tentar obter código FIPE do modelo
                                    # Estratégia: tentar usar o código do modelo formatado como FIPE
                                    # Código FIPE geralmente tem formato: "004278-1"
                                    fipe_code_candidate = f"{model_code:06d}-1"
                                    
                                    try:
                                        details = client.get_vehicle_details(
                                            VehicleType.CARS,
                                            fipe_code=fipe_code_candidate,
                                            year_id=year_code
                                        )
                                        total_requisicoes += 1
                                        
                                        dados.append({
                                            'Marca': details.get('brand', brand_name),
                                            'Modelo': details.get('model', model_name),
                                            'Ano': details.get('modelYear', ''),
                                            'Ano Descrição': year_name,
                                            'Combustível': details.get('fuel', ''),
                                            'Preço': details.get('price', ''),
                                            'Código FIPE': details.get('codeFipe', ''),
                                            'Referência': details.get('referenceMonth', ''),
                                        })
                                        print(f"  ✓ [{len(dados)}] {model_name} {year_name}: {details.get('price', 'N/A')}")
                                        break  # Sair do loop de models_by_year
                                        
                                    except Exception:
                                        # Se falhar, tentar outras variações do código FIPE
                                        for suffix in ['-2', '-3', '']:
                                            try:
                                                fipe_code_variant = f"{model_code:06d}{suffix}"
                                                details = client.get_vehicle_details(
                                                    VehicleType.CARS,
                                                    fipe_code=fipe_code_variant,
                                                    year_id=year_code
                                                )
                                                total_requisicoes += 1
                                                
                                                dados.append({
                                                    'Marca': details.get('brand', brand_name),
                                                    'Modelo': details.get('model', model_name),
                                                    'Ano': details.get('modelYear', ''),
                                                    'Ano Descrição': year_name,
                                                    'Combustível': details.get('fuel', ''),
                                                    'Preço': details.get('price', ''),
                                                    'Código FIPE': details.get('codeFipe', ''),
                                                    'Referência': details.get('referenceMonth', ''),
                                                })
                                                print(f"  ✓ [{len(dados)}] {model_name} {year_name}: {details.get('price', 'N/A')}")
                                                break
                                            except Exception:
                                                continue
                                        break
                                        
                        except Exception as e:
                            # Se não conseguir buscar modelos por ano, pular
                            continue
                        
                        if total_requisicoes >= max_requisicoes:
                            break
                            
                except Exception as e:
                    print(f"  Erro ao buscar anos do modelo {model_name}: {e}")
                    continue
                
                if total_requisicoes >= max_requisicoes:
                    break
                    
        except Exception as e:
            print(f"Erro ao processar marca {brand_name}: {e}")
            continue
    
    print(f"\n{'='*70}")
    print(f"Total de requisições realizadas: {total_requisicoes}")
    print(f"Total de veículos com preços encontrados: {len(dados)}")
    print(f"{'='*70}")
    
    return pd.DataFrame(dados)


def criar_tabela_com_precos_por_fipe(
    client: FipeClient,
    fipe_codes: List[str],
    year_ids: List[str]
) -> pd.DataFrame:
    """
    Cria tabela com preços usando códigos FIPE conhecidos
    
    Args:
        client: Cliente FIPE
        fipe_codes: Lista de códigos FIPE
        year_ids: Lista de IDs de anos (mesma ordem dos códigos FIPE)
        
    Returns:
        DataFrame com dados dos veículos
    """
    dados = []
    
    for fipe_code, year_id in zip(fipe_codes, year_ids):
        try:
            details = client.get_vehicle_details(
                VehicleType.CARS,
                fipe_code=fipe_code,
                year_id=year_id
            )
            
            dados.append({
                'Marca': details.get('brand', ''),
                'Modelo': details.get('model', ''),
                'Ano': details.get('modelYear', ''),
                'Combustível': details.get('fuel', ''),
                'Preço': details.get('price', ''),
                'Código FIPE': details.get('codeFipe', ''),
                'Referência': details.get('referenceMonth', ''),
            })
            
        except Exception as e:
            print(f"Erro ao buscar código FIPE {fipe_code}: {e}")
            continue
    
    return pd.DataFrame(dados)


def exportar_tabela(df: pd.DataFrame, formato: str = 'csv', arquivo: str = 'carros_fipe.csv'):
    """
    Exporta a tabela para arquivo
    
    Args:
        df: DataFrame a exportar
        formato: 'csv', 'excel', 'html', ou 'json'
        arquivo: Nome do arquivo de saída
    """
    if formato.lower() == 'csv':
        df.to_csv(arquivo, index=False, encoding='utf-8-sig')
        print(f"Tabela exportada para {arquivo}")
        
    elif formato.lower() == 'excel':
        arquivo = arquivo.replace('.csv', '.xlsx')
        df.to_excel(arquivo, index=False, engine='openpyxl')
        print(f"Tabela exportada para {arquivo}")
        
    elif formato.lower() == 'html':
        arquivo = arquivo.replace('.csv', '.html')
        df.to_html(arquivo, index=False, classes='table table-striped', table_id='tabela-carros')
        print(f"Tabela exportada para {arquivo}")
        
    elif formato.lower() == 'json':
        arquivo = arquivo.replace('.csv', '.json')
        df.to_json(arquivo, orient='records', indent=2, force_ascii=False)
        print(f"Tabela exportada para {arquivo}")
        
    else:
        print(f"Formato {formato} não suportado. Use: csv, excel, html ou json")


def main():
    """Função principal - Cria tabela com preços de TODOS os carros (SEM LIMITE)"""
    
    # Criar cliente
    client = FipeClient()
    
    print("=" * 70)
    print("CRIANDO TABELA COM PREÇOS DE TODOS OS CARROS - API FIPE")
    print("BUSCA SEM LIMITE")
    print("=" * 70)
    print()
    print("AVISO: Esta busca processará TODAS as marcas, modelos e anos disponíveis.")
    print("Isso pode levar muito tempo e consumir muitas requisições da API.")
    print("Limite da API: 500 requisições/dia (sem token) ou 1000/dia (com token)")
    print()
    
    # Criar tabela com preços - SEM LIMITES
    df_precos = criar_tabela_todos_precos(
        client,
        limite_marcas=None,  # None = sem limite (todas as marcas)
        limite_modelos_por_marca=None,  # None = sem limite (todos os modelos)
        limite_anos_por_modelo=None,  # None = sem limite (todos os anos)
        max_requisicoes=None  # None = sem limite de requisições (use com cuidado!)
    )
    
    if not df_precos.empty:
        print(f"\n{'='*70}")
        print(f"Tabela criada com {len(df_precos)} veículos com preços!")
        print(f"{'='*70}\n")
        
        # Mostrar resumo
        print("Primeiras linhas da tabela:")
        print(df_precos.head(10).to_string(index=False))
        
        # Estatísticas
        print(f"\n{'='*70}")
        print("ESTATÍSTICAS:")
        print(f"{'='*70}")
        print(f"Total de veículos: {len(df_precos)}")
        print(f"Total de marcas únicas: {df_precos['Marca'].nunique()}")
        print(f"Total de modelos únicos: {df_precos['Modelo'].nunique()}")
        
        # Exportar tabela
        print(f"\n{'='*70}")
        print("EXPORTANDO TABELA...")
        print(f"{'='*70}\n")
        
        exportar_tabela(df_precos, formato='csv', arquivo='todos_carros_precos.csv')
        exportar_tabela(df_precos, formato='excel', arquivo='todos_carros_precos.xlsx')
        exportar_tabela(df_precos, formato='html', arquivo='todos_carros_precos.html')
        
        print(f"\n{'='*70}")
        print("TABELA CRIADA COM SUCESSO!")
        print(f"{'='*70}")
        print("\nArquivos gerados:")
        print("  - todos_carros_precos.csv")
        print("  - todos_carros_precos.xlsx")
        print("  - todos_carros_precos.html")
    else:
        print("\nNenhum veículo com preço foi encontrado.")
        print("Tente aumentar os limites ou verifique sua conexão com a API.")


if __name__ == "__main__":
    main()
