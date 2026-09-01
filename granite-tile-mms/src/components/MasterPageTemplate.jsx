import PageHeader from './PageHeader.jsx'
import { StatGrid, StatCard } from './StatCard.jsx'
import FilterBar from './FilterBar.jsx'
import DataTable from './DataTable.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'
import { Plus } from 'lucide-react'

export default function MasterPageTemplate({
  breadcrumbLabel, title, description, translationKey, icon: Icon, stats, columns, rows, filters, addLabel, searchPlaceholder
}) {
  const { t } = useLanguage()
  const displayTitle = (translationKey && t(translationKey) !== translationKey ? t(translationKey) : title)
  const displayDesc = (translationKey && t(`${translationKey}Desc`) !== `${translationKey}Desc` ? t(`${translationKey}Desc`) : description)

  return (
    <>
      <PageHeader
        trail={[{ label: t('home'), path: '/dashboard' }, { label: t('masters') }, { label: displayTitle }]}
        title={displayTitle}
        description={displayDesc}
        actions={[
          <button className="btn btn-primary" key="add"><Plus size={16} /> {addLabel}</button>
        ]}
      />
      {stats && (
        <StatGrid>
          {stats.map((s, i) => <StatCard key={i} {...s} />)}
        </StatGrid>
      )}
      <FilterBar placeholder={searchPlaceholder || `Search ${displayTitle.toLowerCase()}...`} filters={filters} />
      <DataTable columns={columns} rows={rows} />
    </>
  )
}
