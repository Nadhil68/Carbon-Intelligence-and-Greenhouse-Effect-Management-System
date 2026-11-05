import { EmissionRecord, EmissionScope, EmissionSourceCategory, CampusDepartment } from '../types';

export const EMISSION_FACTORS: Record<
  EmissionSourceCategory,
  { factor: number; unit: string; scope: EmissionScope; label: string; description: string }
> = {
  department_electricity: {
    factor: 0.82, // CEA Grid emission factor: ~0.82 kg CO2e/kWh
    unit: 'kWh',
    scope: 'Scope 2',
    label: 'Department Electricity',
    description: 'Academic block classrooms, labs, computing servers, and AC systems',
  },
  hostel_electricity: {
    factor: 0.82,
    unit: 'kWh',
    scope: 'Scope 2',
    label: 'Hostel Electricity & Geysers',
    description: 'Student residential blocks, mess cooking, water heaters, and dorm lighting',
  },
  transportation: {
    factor: 2.68, // kg CO2e per Litre of diesel/fleet fuel
    unit: 'Litres',
    scope: 'Scope 1',
    label: 'Campus Fleet & Transit',
    description: 'College shuttle buses, logistics vans, and campus utility vehicles',
  },
  laboratory_chemicals: {
    factor: 2.98, // kg CO2e per kg LPG / lab compressed gas
    unit: 'Kg',
    scope: 'Scope 1',
    label: 'Labs, Gas & Refrigerants',
    description: 'Chemistry/biotech labs, LPG cylinders, and HVAC refrigerant top-ups',
  },
  campus_waste: {
    factor: 0.58, // kg CO2e per kg unmanaged waste
    unit: 'Kg',
    scope: 'Scope 3',
    label: 'Solid & Organic Waste',
    description: 'Hostel canteen refuse, campus landscape debris, and non-recycled waste',
  },
  solar_renewable_offset: {
    factor: -0.82, // Negative emission factor for avoided grid power
    unit: 'kWh',
    scope: 'Scope 2',
    label: 'Rooftop Solar Offset',
    description: 'Clean energy generation displacing carbon-intensive thermal grid power',
  },
};

export function calculateEmissions(category: EmissionSourceCategory, activityValue: number): number {
  const factor = EMISSION_FACTORS[category]?.factor ?? 0;
  return Number((activityValue * factor).toFixed(2));
}

export function formatTonsCO2e(kg: number): string {
  const tons = kg / 1000;
  return tons.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatKgCO2e(kg: number): string {
  return kg.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

export interface AggregatedMetrics {
  totalGrossKg: number;
  totalOffsetKg: number;
  totalNetKg: number;
  totalGrossTons: number;
  totalOffsetTons: number;
  totalNetTons: number;
  scope1Tons: number;
  scope2Tons: number;
  scope3Tons: number;
  perCapitaNetKg: number;
  departmentRankings: Array<{
    department: CampusDepartment;
    netKg: number;
    netTons: number;
    percentage: number;
  }>;
  categoryBreakdown: Array<{
    category: EmissionSourceCategory;
    label: string;
    grossKg: number;
    grossTons: number;
    percentage: number;
  }>;
}

export function calculateAggregateMetrics(
  records: EmissionRecord[],
  totalCampusPopulation = 4850
): AggregatedMetrics {
  let grossKg = 0;
  let offsetKg = 0;
  let scope1Kg = 0;
  let scope2GrossKg = 0;
  let scope3Kg = 0;

  const deptMap = new Map<CampusDepartment, number>();
  const catMap = new Map<EmissionSourceCategory, number>();

  records.forEach((r) => {
    if (r.category === 'solar_renewable_offset') {
      const avoided = Math.abs(r.totalEmissionKgCO2e);
      offsetKg += avoided;
    } else {
      grossKg += r.totalEmissionKgCO2e;
      catMap.set(r.category, (catMap.get(r.category) || 0) + r.totalEmissionKgCO2e);

      deptMap.set(r.department, (deptMap.get(r.department) || 0) + r.totalEmissionKgCO2e);

      if (r.scope === 'Scope 1') scope1Kg += r.totalEmissionKgCO2e;
      else if (r.scope === 'Scope 2') scope2GrossKg += r.totalEmissionKgCO2e;
      else if (r.scope === 'Scope 3') scope3Kg += r.totalEmissionKgCO2e;
    }
  });

  const netKg = Math.max(0, grossKg - offsetKg);

  const departmentRankings = Array.from(deptMap.entries())
    .map(([department, kg]) => ({
      department,
      netKg: kg,
      netTons: kg / 1000,
      percentage: grossKg > 0 ? (kg / grossKg) * 100 : 0,
    }))
    .sort((a, b) => b.netKg - a.netKg);

  const categoryBreakdown = Object.entries(EMISSION_FACTORS)
    .filter(([key]) => key !== 'solar_renewable_offset')
    .map(([key, meta]) => {
      const catKg = catMap.get(key as EmissionSourceCategory) || 0;
      return {
        category: key as EmissionSourceCategory,
        label: meta.label,
        grossKg: catKg,
        grossTons: catKg / 1000,
        percentage: grossKg > 0 ? (catKg / grossKg) * 100 : 0,
      };
    })
    .sort((a, b) => b.grossKg - a.grossKg);

  return {
    totalGrossKg: grossKg,
    totalOffsetKg: offsetKg,
    totalNetKg: netKg,
    totalGrossTons: grossKg / 1000,
    totalOffsetTons: offsetKg / 1000,
    totalNetTons: netKg / 1000,
    scope1Tons: scope1Kg / 1000,
    scope2Tons: scope2GrossKg / 1000,
    scope3Tons: scope3Kg / 1000,
    perCapitaNetKg: totalCampusPopulation > 0 ? netKg / totalCampusPopulation : 0,
    departmentRankings,
    categoryBreakdown,
  };
}
