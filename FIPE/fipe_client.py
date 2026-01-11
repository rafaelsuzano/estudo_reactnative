"""
Cliente Python para a API FIPE
Documentação: https://deividfortuna.github.io/fipe/v2/
"""

import requests
from typing import Optional, List, Dict, Any
from enum import Enum


class VehicleType(Enum):
    """Tipos de veículos suportados pela API FIPE"""
    CARS = "cars"
    MOTORCYCLES = "motorcycles"
    TRUCKS = "trucks"


class FipeClient:
    """Cliente para consultar a API FIPE"""
    
    BASE_URL = "https://fipe.parallelum.com.br/api/v2"
    
    def __init__(self, subscription_token: Optional[str] = None):
        """
        Inicializa o cliente FIPE
        
        Args:
            subscription_token: Token de assinatura (opcional, aumenta limite de requisições)
        """
        self.subscription_token = subscription_token
        self.session = requests.Session()
        
        # Configura headers padrão
        self.session.headers.update({
            'accept': 'application/json',
            'content-type': 'application/json'
        })
        
        if self.subscription_token:
            self.session.headers.update({
                'X-Subscription-Token': self.subscription_token
            })
    
    def _make_request(self, endpoint: str, params: Optional[Dict] = None) -> Dict[Any, Any]:
        """
        Faz uma requisição GET para a API
        
        Args:
            endpoint: Endpoint da API (sem a base URL)
            params: Parâmetros da query string
            
        Returns:
            Resposta JSON da API
            
        Raises:
            requests.RequestException: Em caso de erro na requisição
        """
        url = f"{self.BASE_URL}/{endpoint}"
        
        try:
            response = self.session.get(url, params=params)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            raise Exception(f"Erro ao consultar API FIPE: {str(e)}")
    
    def get_references(self) -> List[Dict[str, str]]:
        """
        Retorna as referências de meses da FIPE
        
        Returns:
            Lista de referências com código e mês
            Exemplo: [{"code": "308", "month": "abril de 2024"}]
        """
        return self._make_request("references")
    
    def get_brands(
        self, 
        vehicle_type: VehicleType = VehicleType.CARS,
        reference: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Retorna as marcas para o tipo de veículo
        
        Args:
            vehicle_type: Tipo de veículo (cars, motorcycles, trucks)
            reference: Código de referência (mês e ano)
            
        Returns:
            Lista de marcas com código e nome
            Exemplo: [{"code": "23", "name": "VW - VolksWagen"}]
        """
        endpoint = f"{vehicle_type.value}/brands"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_models(
        self,
        vehicle_type: VehicleType,
        brand_id: int,
        reference: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Retorna os modelos para a marca
        
        Args:
            vehicle_type: Tipo de veículo
            brand_id: ID da marca
            reference: Código de referência (opcional)
            
        Returns:
            Lista de modelos
        """
        endpoint = f"{vehicle_type.value}/brands/{brand_id}/models"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_years_by_brand(
        self,
        vehicle_type: VehicleType,
        brand_id: int,
        reference: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Retorna os anos disponíveis para a marca
        
        Args:
            vehicle_type: Tipo de veículo
            brand_id: ID da marca
            reference: Código de referência (opcional)
            
        Returns:
            Lista de anos disponíveis
        """
        endpoint = f"{vehicle_type.value}/{brand_id}/years"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_years_by_model(
        self,
        vehicle_type: VehicleType,
        brand_id: int,
        model_id: int,
        reference: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Retorna os anos disponíveis para o modelo
        
        Args:
            vehicle_type: Tipo de veículo
            brand_id: ID da marca
            model_id: ID do modelo
            reference: Código de referência (opcional)
            
        Returns:
            Lista de anos disponíveis
            Exemplo: [{"code": "2022-3", "name": "2022 Diesel"}]
        """
        endpoint = f"{vehicle_type.value}/brands/{brand_id}/models/{model_id}/years"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_models_by_brand_and_year(
        self,
        vehicle_type: VehicleType,
        brand_id: int,
        year_id: str,
        reference: Optional[int] = None
    ) -> List[Dict[str, Any]]:
        """
        Retorna os modelos disponíveis para marca e ano
        
        Args:
            vehicle_type: Tipo de veículo
            brand_id: ID da marca
            year_id: ID do ano (formato: "2022-3")
            reference: Código de referência (opcional)
            
        Returns:
            Lista de modelos
        """
        endpoint = f"{vehicle_type.value}/{brand_id}/years/{year_id}/models"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_years_by_fipe_code(
        self,
        vehicle_type: VehicleType,
        fipe_code: str,
        reference: Optional[int] = None
    ) -> List[Dict[str, str]]:
        """
        Retorna os anos disponíveis por código FIPE
        
        Args:
            vehicle_type: Tipo de veículo
            fipe_code: Código FIPE (formato: "004278-1")
            reference: Código de referência (opcional)
            
        Returns:
            Lista de anos disponíveis
        """
        endpoint = f"{vehicle_type.value}/{fipe_code}/years"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_vehicle_details(
        self,
        vehicle_type: VehicleType,
        fipe_code: str,
        year_id: str,
        reference: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Retorna as informações da FIPE para o veículo (estimativa de preço)
        
        Args:
            vehicle_type: Tipo de veículo
            fipe_code: Código FIPE (formato: "004278-1")
            year_id: ID do ano (formato: "2014-3")
            reference: Código de referência (opcional)
            
        Returns:
            Dicionário com informações do veículo incluindo preço
            Exemplo: {
                "brand": "VW - VolksWagen",
                "codeFipe": "005340-6",
                "fuel": "Diesel",
                "model": "AMAROK High.CD 2.0...",
                "modelYear": 2014,
                "price": "R$ 10.000,00",
                ...
            }
        """
        endpoint = f"{vehicle_type.value}/{fipe_code}/years/{year_id}"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)
    
    def get_vehicle_history(
        self,
        vehicle_type: VehicleType,
        fipe_code: str,
        year_id: str,
        reference: Optional[int] = None
    ) -> Dict[str, Any]:
        """
        Retorna o histórico de preços do veículo
        
        Args:
            vehicle_type: Tipo de veículo
            fipe_code: Código FIPE (formato: "004278-1")
            year_id: ID do ano (formato: "2014-3")
            reference: Código de referência (opcional)
            
        Returns:
            Dicionário com histórico de preços
        """
        endpoint = f"{vehicle_type.value}/{fipe_code}/years/{year_id}/history"
        params = {"reference": reference} if reference else None
        return self._make_request(endpoint, params)


# Funções de conveniência para uso direto
def get_references(subscription_token: Optional[str] = None) -> List[Dict[str, str]]:
    """Função de conveniência para obter referências"""
    client = FipeClient(subscription_token)
    return client.get_references()


def get_brands(
    vehicle_type: VehicleType = VehicleType.CARS,
    reference: Optional[int] = None,
    subscription_token: Optional[str] = None
) -> List[Dict[str, str]]:
    """Função de conveniência para obter marcas"""
    client = FipeClient(subscription_token)
    return client.get_brands(vehicle_type, reference)


def get_vehicle_price(
    vehicle_type: VehicleType,
    fipe_code: str,
    year_id: str,
    reference: Optional[int] = None,
    subscription_token: Optional[str] = None
) -> Dict[str, Any]:
    """Função de conveniência para obter preço do veículo"""
    client = FipeClient(subscription_token)
    return client.get_vehicle_details(vehicle_type, fipe_code, year_id, reference)
