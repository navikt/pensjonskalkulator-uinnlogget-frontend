import { Heading, BodyLong, Link } from '@navikt/ds-react'
import stepStyles from './styles/stepStyles.module.css'

const Forbehold = () => {
  return (
    <div>
      <Heading level="2" size="medium" className={stepStyles.overskrift}>
        Forbehold
      </Heading>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Uinnlogget pensjonskalkulator gir deg en forenklet pensjonsberegning.
        Beregningen viser et estimat på alderspensjon fra folketrygden og
        eventuell AFP fra privat sektor. Beregningen er kun basert på
        opplysninger som du har lagt inn i kalkulatoren.
      </BodyLong>
      <Heading level="3" size="small">
        Opphold utenfor Norge
      </Heading>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Vi legger til grunn at du bor i Norge. Du kan ha rett til pensjon fra
        andre land du har jobbet eller bodd i. Pensjon fra andre land er ikke
        med i beregningen. Vi tar heller ikke hensyn til avtaler Norge har med
        andre land. Tidspunktet for når du kan ta ut pensjon kan derfor bli
        feil.
      </BodyLong>
      <Heading level="3" size="small">
        Inntekt
      </Heading>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Vi bruker inntekten og hvor mange år du har jobbet som utgangspunkt for
        å beregne pensjonsopptjeningen din. Beregningen din vil derfor ikke bli
        helt nøyaktig. Inntekt er pensjonsgivende til og med året du fyller 75
        år.
      </BodyLong>
      <Heading level="3" size="small">
        Avtalefestet pensjon (AFP)
      </Heading>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Hvis du oppgir at du har rett til AFP, viser vi AFP i beregningen, men
        vi vurderer ikke om du har rett til det. Kalkulatoren forutsetter at du
        har rett til pensjonen du har valgt å beregne.
      </BodyLong>
      <Heading level="3" size="small">
        Mottar du uføretrygd eller andre ytelser?
      </Heading>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Det kan påvirke pensjonen din. Kalkulatoren tar ikke hensyn til dette.
        Du bør derfor bruke{' '}
        <Link href="https://www.nav.no/pensjon/kalkulator/login">
          innlogget kalkulator
        </Link>{' '}
        eller{' '}
        <Link href="https://www.nav.no/planlegger-pensjon#noe-du-ikke-finner-svaret-p-her">
          kontakte Nav.
        </Link>
      </BodyLong>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Beregningen er gjort med gjeldende regelverk og vises i dagens
        kroneverdi før skatt. Beregningen er ikke juridisk bindende.
      </BodyLong>
      <BodyLong size="small" className={stepStyles.underOverskrift}>
        Hvis du ønsker en mer detaljert beregning basert på opplysninger vi har
        om deg, må du bruke{' '}
        <Link href="https://www.nav.no/pensjon/kalkulator/login">
          innlogget kalkulator
        </Link>
      </BodyLong>
    </div>
  )
}

export default Forbehold
