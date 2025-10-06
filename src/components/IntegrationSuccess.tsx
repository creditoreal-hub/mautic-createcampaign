import React from 'react';
import { CheckCircle, Copy, ExternalLink, RefreshCw, Target, Users } from 'lucide-react';
import { IntegrationPayload } from '../types/integration';

interface IntegrationSuccessProps {
  data: IntegrationPayload;
  onNewIntegration: () => void;
}

export default function IntegrationSuccess({ data, onNewIntegration }: IntegrationSuccessProps) {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('Dados copiados para a área de transferência!');
  };

  const mockWebhookResponse = {
    status: 'success',
    message: 'Mautic campaign and segment created successfully',
    mautic_campaign_id: Math.floor(Math.random() * 1000) + 100,
    mautic_segment_id: Math.floor(Math.random() * 1000) + 200,
    campaign_name: data.campaign.name,
    segment_name: data.campaign.segmentName,
    processed_at: new Date().toISOString(),
    users_added_to_segment: data.expectedUsers || 0,
    roles_targeted: data.campaign.roles,
    geographic_filters: Object.values(data.campaign.filters).filter(f => f.trim() !== '').length,
    is_published: data.campaign.mauticSettings.isPublished
  };

  return (
    <div className="space-y-8">
      {/* Success Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-credito-orange-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-credito-orange-600" />
        </div>
        <h2 className="text-2xl font-bold text-credito-gray-800 mb-2">Fluxo N8N Executado com Sucesso!</h2>
        <p className="text-credito-gray-600">
          O fluxo N8N foi executado para criar a campanha "{data.campaign.name}" e o segmento "{data.campaign.segmentName}" no Mautic.
        </p>
      </div>

      {/* Mautic Integration Details */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-credito-orange-100 rounded-lg">
            <Target className="w-5 h-5 text-credito-orange-600" />
          </div>
          <h3 className="text-lg font-semibold text-credito-gray-800">Detalhes da Integração Mautic</h3>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">Campanha Mautic:</span>
            <span className="font-medium text-credito-gray-800">{data.campaign.name}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">Segmento Mautic:</span>
            <span className="font-medium text-credito-gray-800">{data.campaign.segmentName}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">ID da Campanha:</span>
            <span className="font-medium text-credito-gray-800">#{mockWebhookResponse.mautic_campaign_id}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">ID do Segmento:</span>
            <span className="font-medium text-credito-gray-800">#{mockWebhookResponse.mautic_segment_id}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">Usuários Adicionados:</span>
            <span className="font-medium text-credito-orange-600">{mockWebhookResponse.users_added_to_segment}</span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">Status:</span>
            <span className="font-medium text-credito-gray-800">
              {data.campaign.mauticSettings.isPublished ? 'Publicado' : 'Rascunho'}
            </span>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-credito-orange-100">
            <span className="text-credito-gray-600">Timestamp:</span>
            <span className="font-medium text-credito-gray-800">
              {new Date(data.timestamp).toLocaleString('pt-BR')}
            </span>
          </div>
        </div>
      </div>

      {/* N8N Response */}
      {data.webhookResponse && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-credito-gray-800">Resposta do Webhook N8N</h3>
            <span className="px-3 py-1 bg-credito-orange-100 text-credito-orange-700 text-sm rounded-full">
              Fluxo Executado
            </span>
          </div>
          
          <div className="bg-credito-gray-50 rounded-lg p-4">
            <pre className="text-sm text-credito-gray-700 overflow-x-auto">
              {JSON.stringify(data.webhookResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

      {/* Webhook URL Used */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-credito-gray-800">URL do Webhook Executada</h3>
          <span className="px-3 py-1 bg-credito-orange-100 text-credito-orange-700 text-sm rounded-full">
            Requisição Enviada
          </span>
        </div>
        
        <div className="bg-credito-gray-50 rounded-lg p-4">
          <code className="text-sm text-credito-gray-700 break-all">
            {data.webhook_url}
          </code>
        </div>
        
        <div className="mt-4">
          <button
            onClick={() => navigator.clipboard.writeText(data.webhook_url)}
            className="flex items-center gap-2 px-4 py-2 border border-credito-gray-300 text-credito-gray-700 rounded-lg hover:bg-credito-orange-50 transition-colors"
          >
            <Copy className="w-4 h-4" />
            Copiar URL
          </button>
        </div>
      </div>

      {/* Target Audience Details */}
      {data.campaign.roles.length > 0 && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-credito-orange-100 rounded-lg">
              <Users className="w-5 h-5 text-credito-orange-600" />
            </div>
            <h3 className="text-lg font-semibold text-credito-gray-800">Público-Alvo do Segmento</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {data.campaign.roles.map((role) => (
              <span
                key={role}
                className="px-3 py-2 bg-credito-orange-100 text-credito-orange-700 text-sm rounded-full font-medium"
              >
                {role}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Geographic Filters Applied */}
      {Object.values(data.campaign.filters).some(f => f.trim() !== '') && (
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
          <h3 className="text-lg font-semibold text-credito-gray-800 mb-4">Filtros Aplicados</h3>
          <div className="space-y-2">
            {Object.entries(data.campaign.filters).map(([key, value]) => {
              if (!value.trim()) return null;
              const labels = {
                condominio: 'Condomínio',
                cidade: 'Cidade',
                bairro: 'Bairro',
                estado: 'Estado'
              };
              return (
                <div key={key} className="flex justify-between items-center py-2 border-b border-credito-orange-100 last:border-b-0">
                  <span className="text-credito-gray-600">{labels[key as keyof typeof labels]}:</span>
                  <span className="font-medium text-credito-gray-800">{value}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mautic Settings Applied */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-credito-orange-100">
        <h3 className="text-lg font-semibold text-credito-gray-800 mb-4">Configurações Aplicadas</h3>
        <div className="space-y-3">
          {data.campaign.mauticSettings.campaignDescription && (
            <div>
              <span className="text-sm font-medium text-credito-gray-600">Descrição da Campanha:</span>
              <p className="text-credito-gray-800 mt-1">{data.campaign.mauticSettings.campaignDescription}</p>
            </div>
          )}
          {data.campaign.mauticSettings.segmentDescription && (
            <div>
              <span className="text-sm font-medium text-credito-gray-600">Descrição do Segmento:</span>
              <p className="text-credito-gray-800 mt-1">{data.campaign.mauticSettings.segmentDescription}</p>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-credito-gray-600">Status de Publicação:</span>
            <span className={`px-2 py-1 text-xs rounded-full ${
              data.campaign.mauticSettings.isPublished 
                ? 'bg-credito-orange-100 text-credito-orange-700' 
                : 'bg-credito-gray-100 text-credito-gray-700'
            }`}>
              {data.campaign.mauticSettings.isPublished ? 'Publicado' : 'Rascunho'}
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={copyToClipboard}
          className="flex items-center gap-2 px-6 py-3 border border-credito-gray-300 text-credito-gray-700 rounded-lg hover:bg-credito-orange-50 transition-colors"
        >
          <Copy className="w-4 h-4" />
          Copiar Dados
        </button>
        
        <button
          onClick={onNewIntegration}
          className="flex items-center gap-2 px-8 py-3 bg-credito-orange-600 text-white rounded-lg hover:bg-credito-orange-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Nova Campanha
        </button>
      </div>
    </div>
  );
}