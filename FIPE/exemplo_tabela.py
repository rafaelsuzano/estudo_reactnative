"""
Exemplo rápido de como criar uma tabela com dados de carros
"""

from criar_tabela_carros import (
    criar_tabela_simples,
    criar_tabela_marcas_modelos_anos,
    criar_tabela_com_precos_por_fipe,
    exportar_tabela
)
from fipe_client import FipeClient, VehicleType

# Criar cliente
client = FipeClient()

# Exemplo 1: Tabela simples (marcas e modelos)
print("Criando tabela simples...")
df = criar_tabela_simples(client, limite=20)
print(f"\nTabela com {len(df)} registros:")
print(df.head(10))
print("\n" + "="*60 + "\n")

# Exemplo 2: Tabela completa (marcas, modelos e anos)
print("Criando tabela com anos...")
df_completa = criar_tabela_marcas_modelos_anos(
    client,
    limite_marcas=3,
    limite_modelos_por_marca=2,
    limite_anos_por_modelo=2
)
print(f"\nTabela com {len(df_completa)} registros:")
print(df_completa)
print("\n" + "="*60 + "\n")

# Exemplo 3: Exportar para CSV
print("Exportando tabela para CSV...")
exportar_tabela(df, formato='csv', arquivo='exemplo_carros.csv')
print("\n" + "="*60 + "\n")

# Exemplo 4: Tabela com preços (precisa de códigos FIPE)
print("Criando tabela com preços...")
fipe_codes = ["004278-1", "005340-6"]
year_ids = ["2014-3", "2014-3"]

df_precos = criar_tabela_com_precos_por_fipe(client, fipe_codes, year_ids)
if not df_precos.empty:
    print(f"\nTabela com preços ({len(df_precos)} registros):")
    print(df_precos.to_string(index=False))
    exportar_tabela(df_precos, formato='csv', arquivo='exemplo_precos.csv')
