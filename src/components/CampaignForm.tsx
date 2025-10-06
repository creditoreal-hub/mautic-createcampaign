import React, { useState } from 'react';
import { Building2, Users, Filter, Zap, Eye, X, Target, Settings } from 'lucide-react';
import { CampaignData, AVAILABLE_ROLES, BRAZILIAN_STATES, IntegrationPayload } from '../types/integration';

interface CampaignFormProps {
  onIntegrate: (data: IntegrationPayload) => void;
}

export default function CampaignForm({ onIntegrate }: CampaignFormProps) {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: '',
    segmentName: '',
    roles: [],
    filters: {
      condominio: '',
      cidade: '',
      bairro: '',
      estado: ''
    },
    mauticSettings: {
      campaignDescription: '',
      segmentDescription: '',
      isPublished: true
    }
  });

  const [showPreview, setShowPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRoleToggle = (role: string) => {
    setCampaignData(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role]
    }));
  };

  const handleFilterChange = (filterType: keyof CampaignData['filters'], value: string) => {
    setCampaignData(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [filterType]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignData.name.trim() || !campaignData.segmentName.trim() || campaignData.roles.length === 0) {
      alert('Por favor, preencha o nome da campanha, nome do segmento e selecione pelo menos um papel.');
      return;
    }

    setIsSubmitting(true);
    
    try {
    setIsSubmitting(true);
    
    try {
      // Preparar parâmetros para o webhook do N8N
      const webhookParams = new URLSearchParams({
        name: campaignData.name,
        segmentName: campaignData.segmentName,
        roles: campaignData.roles.join(','),
        condominio: campaignData.filters.condominio || '',
        cidade: campaignData.filters.cidade || '',
        bairro: campaignData.filters.bairro || '',
        estado: campaignData.filters.estado || '',
        campaignDescription: campaignData.mauticSettings.campaignDescription || '',
        segmentDescription: campaignData.mauticSettings.segmentDescription || '',
        isPublished: campaignData.mauticSettings.isPublished ? '1' : '0',
        timestamp: new Date().toISOString()
      });

      // Fazer requisição para o webhook do N8N
      const webhookUrl = `https://omnibox-flow.creditoreal.com.br/webhook/testemautic?${webhookParams.toString()}`;
      
      const response = await fetch(webhookUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
      }

      const result = await response.json().catch(() => ({ success: true }));
      
      // Criar payload para exibir na tela de sucesso
      const integrationPayload: IntegrationPayload = {
        campaign: campaignData,
        timestamp: new Date().toISOString(),
        webhook_url: webhookUrl,
        action: 'create_mautic_campaign_and_segment',
        expectedUsers: Math.floor(Math.random() * 500) + 50,
        webhookResponse: result
      };

      onIntegrate(integrationPayload);
    } catch (error) {
      console.error('Erro ao executar fluxo N8N:', error);
      alert(`Erro ao executar fluxo N8N: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
    } catch (error) {
      console.error('Erro ao executar fluxo N8N:', error);
      alert(`Erro ao executar fluxo N8N: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePreview = () => {
    if (!campaignData.name.trim() || !campaignData.segmentName.trim() || campaignData.roles.length === 0) {
      alert('Por favor, preencha o nome da campanha, nome do segmento e selecione pelo menos um papel antes de visualizar.');
      return;
    }
    setShowPreview(true);
  };

  const hasActiveFilters = Object.values(campaignData.filters).some(filter => filter.trim() !== '');

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Campaign Name Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-credito-orange-100 rounded-lg">
              <Target className="w-5 h-5 text-credito-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-credito-gray-800">Campanha e Segmento Mautic</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Nome da Campanha Mautic *
              </label>
              <input
                type="text"
                id="campaignName"
                value={campaignData.name}
                onChange={(e) => {
                  const value = e.target.value;
                  setCampaignData(prev => ({ 
                    ...prev, 
                    name: value,
                    segmentName: prev.segmentName || `Segmento ${value}`
                  }));
                }}
                placeholder="Ex: Campanha Verão 2024"
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label htmlFor="segmentName" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Nome do Segmento Mautic *
              </label>
              <input
                type="text"
                id="segmentName"
                value={campaignData.segmentName}
                onChange={(e) => setCampaignData(prev => ({ ...prev, segmentName: e.target.value }))}
                placeholder="Ex: Segmento Campanha Verão 2024"
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>
        </div>

        {/* Mautic Settings Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-credito-orange-100 rounded-lg">
              <Settings className="w-5 h-5 text-credito-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-credito-gray-800">Configurações Mautic</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="campaignDescription" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Descrição da Campanha
              </label>
              <textarea
                id="campaignDescription"
                value={campaignData.mauticSettings.campaignDescription}
                onChange={(e) => setCampaignData(prev => ({ 
                  ...prev, 
                  mauticSettings: { ...prev.mauticSettings, campaignDescription: e.target.value }
                }))}
                placeholder="Descreva o objetivo desta campanha..."
                rows={3}
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="segmentDescription" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Descrição do Segmento
              </label>
              <textarea
                id="segmentDescription"
                value={campaignData.mauticSettings.segmentDescription}
                onChange={(e) => setCampaignData(prev => ({ 
                  ...prev, 
                  mauticSettings: { ...prev.mauticSettings, segmentDescription: e.target.value }
                }))}
                placeholder="Descreva os critérios deste segmento..."
                rows={3}
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={campaignData.mauticSettings.isPublished}
                onChange={(e) => setCampaignData(prev => ({ 
                  ...prev, 
                  mauticSettings: { ...prev.mauticSettings, isPublished: e.target.checked }
                }))}
                className="w-4 h-4 text-credito-orange-600 border-credito-gray-300 rounded focus:ring-credito-orange-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-credito-gray-700">
                Publicar campanha e segmento imediatamente
              </label>
            </div>
          </div>
        </div>

        {/* Target Audience Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-credito-orange-100 rounded-lg">
              <Users className="w-5 h-5 text-credito-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-credito-gray-800">Público-Alvo (Papéis)</h2>
            <span className="text-sm text-credito-gray-500">({campaignData.roles.length} selecionados)</span>
          </div>
          
          <p className="text-sm text-credito-gray-600 mb-4">
            Selecione os papéis dos usuários que serão incluídos no segmento Mautic:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {AVAILABLE_ROLES.map((role) => (
              <label
                key={role}
                className="flex items-center gap-3 p-4 border border-credito-orange-200 rounded-lg hover:bg-credito-orange-50 cursor-pointer transition-colors group"
              >
                <input
                  type="checkbox"
                  checked={campaignData.roles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                  className="w-4 h-4 text-credito-orange-600 border-credito-gray-300 rounded focus:ring-credito-orange-500"
                />
                <span className="text-sm font-medium text-credito-gray-700 group-hover:text-credito-gray-900">
                  {role}
                </span>
              </label>
            ))}
          </div>

          {campaignData.roles.length === 0 && (
            <p className="text-sm text-credito-orange-600 mt-3">* Selecione pelo menos um papel para criar o segmento</p>
          )}
        </div>

        {/* Geographic Filters Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-credito-orange-100 rounded-lg">
              <Filter className="w-5 h-5 text-credito-orange-600" />
            </div>
            <h2 className="text-xl font-semibold text-credito-gray-800">Filtros</h2>
            {hasActiveFilters && (
              <span className="px-3 py-1 bg-credito-orange-100 text-credito-orange-700 text-xs rounded-full">
                Filtros ativos
              </span>
            )}
          </div>
          
          <p className="text-sm text-credito-gray-600 mb-4">
            Refine o segmento aplicando filtros específicos:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="condominio" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Condomínio
              </label>
              <input
                type="text"
                id="condominio"
                value={campaignData.filters.condominio}
                onChange={(e) => handleFilterChange('condominio', e.target.value)}
                placeholder="Ex: Residencial Jardim das Flores"
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Cidade
              </label>
              <input
                type="text"
                id="cidade"
                value={campaignData.filters.cidade}
                onChange={(e) => handleFilterChange('cidade', e.target.value)}
                placeholder="Ex: São Paulo"
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="bairro" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Bairro
              </label>
              <input
                type="text"
                id="bairro"
                value={campaignData.filters.bairro}
                onChange={(e) => handleFilterChange('bairro', e.target.value)}
                placeholder="Ex: Vila Madalena"
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              />
            </div>

            <div>
              <label htmlFor="estado" className="block text-sm font-medium text-credito-gray-700 mb-2">
                Estado
              </label>
              <select
                id="estado"
                value={campaignData.filters.estado}
                onChange={(e) => handleFilterChange('estado', e.target.value)}
                className="w-full px-4 py-3 border border-credito-gray-300 rounded-lg focus:ring-2 focus:ring-credito-orange-500 focus:border-transparent transition-colors"
              >
                <option value="">Todos os estados</option>
                {BRAZILIAN_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name} - {state.code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            disabled={isSubmitting}
            className="flex items-center gap-2 px-8 py-3 bg-credito-orange-600 text-white rounded-lg hover:bg-credito-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Zap className="w-4 h-4" />
            {isSubmitting ? 'Criando no Mautic...' : 'Gerar Campanha'}
          </button>
        </div>
      </form>

      {/* Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-credito-gray-800">Preview da Integração Mautic</h3>
                <button
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-credito-orange-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-credito-gray-500" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-credito-orange-50 p-4 rounded-lg">
                <h4 className="font-semibold text-credito-orange-800 mb-2">Dados que serão enviados para N8N:</h4>
              </div>
              <pre className="bg-credito-gray-50 p-4 rounded-lg text-sm overflow-x-auto">
                {JSON.stringify({
                  campaign: campaignData,
                  timestamp: new Date().toISOString(),
                  webhook_url: 'https://your-n8n-instance.com/webhook/mautic-integration',
                  action: 'create_mautic_campaign_and_segment',
                  expectedUsers: Math.floor(Math.random() * 500) + 50
                }, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </>
  );
}