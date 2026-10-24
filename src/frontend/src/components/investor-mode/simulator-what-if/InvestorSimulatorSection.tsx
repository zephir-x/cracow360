import { useEffect, useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { cracow360Api } from '../../../api/client';
import { useTranslation } from '../../../i18n/I18nContext';
import { getInvestorSimulatorLabels } from '../../../i18n/investorSimulatorI18n';
import type { DistrictDetailsDto, DistrictSummaryDto } from '../../../types/contracts';
import { DistrictSimulatorToolbar } from './DistrictSimulatorToolbar';
import { MunicipalGuidelinesMatrix } from './MunicipalGuidelinesMatrix';
import { SimulatorImpactDisplay } from './SimulatorImpactDisplay';
import { SimulatorLeversPanel } from './SimulatorLeversPanel';
import {
  calculateWhatIfImpact,
  DEFAULT_SIMULATOR_INPUTS,
  mapDetailsToBaseline,
} from './simulatorCalculations';
import type { BaselineDistrictMetrics, SimulatorInputs } from './types';

export interface InvestorSimulatorSectionProps {
  districts: DistrictSummaryDto[];
}

export function InvestorSimulatorSection({ districts }: InvestorSimulatorSectionProps) {
  const { language } = useTranslation();
  const labels = useMemo(() => getInvestorSimulatorLabels(language), [language]);

  // District details map cache
  const [detailsMap, setDetailsMap] = useState<Map<number, DistrictDetailsDto>>(new Map());
  const [_isLoading, setIsLoading] = useState<boolean>(true);

  // Default to District IV Prądnik Biały (districtId = 4) as showcased in the hero description
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(4);
  const [inputs, setInputs] = useState<SimulatorInputs>(DEFAULT_SIMULATOR_INPUTS);

  // Fetch full details for all 18 districts
  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    Promise.all(districts.map((d: DistrictSummaryDto) => cracow360Api.getDistrictDetails(d.districtId)))
      .then((results) => {
        if (!cancelled) {
          const map = new Map<number, DistrictDetailsDto>();
          results.forEach((d: DistrictDetailsDto) => map.set(d.districtId, d));
          setDetailsMap(map);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.error('Failed to load district details for what-if simulator:', err);
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [districts]);

  // Map baseline district metrics
  const baselineList: BaselineDistrictMetrics[] = useMemo(() => {
    return districts
      .map((d) => {
        const detail = detailsMap.get(d.districtId);
        if (!detail) return null;
        return mapDetailsToBaseline(detail);
      })
      .filter((item): item is BaselineDistrictMetrics => item !== null);
  }, [districts, detailsMap]);

  // Active baseline district for simulation
  const activeBaseline = useMemo(() => {
    return (
      baselineList.find((d) => d.districtId === selectedDistrictId) ??
      baselineList[0] ??
      null
    );
  }, [baselineList, selectedDistrictId]);

  // Calculate live What-If impact
  const simulatedImpact = useMemo(() => {
    if (!activeBaseline) return null;
    return calculateWhatIfImpact(activeBaseline, inputs);
  }, [activeBaseline, inputs]);

  return (
    <section
      id="investor-simulator-section"
      className="rounded-3xl border border-slate-200/90 bg-white/80 backdrop-blur-md shadow-xs p-6 sm:p-8 space-y-7 text-slate-900 transition-all scroll-mt-20"
    >
      {/* Section Header */}
      <div className="space-y-1.5">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          {labels.sectionBadge}
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          {labels.sectionTitle}
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-4xl leading-relaxed">
          {labels.sectionSubtitle}
        </p>
      </div>

      {/* 1. District Selection & Quick Presets Toolbar */}
      <DistrictSimulatorToolbar
        districts={baselineList}
        selectedDistrictId={selectedDistrictId}
        onSelectDistrict={setSelectedDistrictId}
        inputs={inputs}
        onUpdateInputs={setInputs}
        activeBaseline={activeBaseline}
        labels={labels}
        language={language}
      />

      {/* 2. Interactive Levers & Financial CAPEX Panel */}
      {simulatedImpact && (
        <SimulatorLeversPanel
          inputs={inputs}
          onChangeInputs={setInputs}
          labels={labels}
          estimatedCapexPln={simulatedImpact.estimatedCapexPln}
          nurseryCapexPln={simulatedImpact.estimatedNurseryCapexPln}
          casCapexPln={simulatedImpact.estimatedCasCapexPln}
          parksCapexPln={simulatedImpact.estimatedParksCapexPln}
        />
      )}

      {/* 3. Live Before vs After Impact Telemetry & Executive Decision Support Note */}
      {activeBaseline && simulatedImpact && (
        <SimulatorImpactDisplay
          baseline={activeBaseline}
          simulated={simulatedImpact}
          labels={labels}
          language={language}
        />
      )}

      {/* 4. Cross-Sector Municipal Guidelines Matrix (Senior CAS, Greenery & Financing Models) */}
      <MunicipalGuidelinesMatrix labels={labels} />
    </section>
  );
}
