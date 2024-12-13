'use client'

import {
  Box,
  Button,
  Heading,
  HStack,
  Link,
  VStack,
  BodyLong,
  List,
} from '@navikt/ds-react'
import stepStyles from './styles/stepStyles.module.css'
import React from 'react'
import Substep from './Substep'

export default function LandingPage() {
  const Icon = ({ color }: { color: string }) => (
    <Box
      width="1rem"
      height="1rem"
      style={{ background: color }}
      borderRadius="full"
      aria-hidden
    ></Box>
  )

  return (
    <Box className={stepStyles.centerBox}>
      <Box
        marginBlock={'auto'}
        width={'100%'}
        maxWidth={'40rem'}
        padding={'4'}
        className={stepStyles.footerSpacing}
      >
        <Heading level="2" size="large" className={stepStyles.overskrift}>
          Uinnlogget pensjonskalkulator
        </Heading>
        <VStack gap={'5'}>
          <Heading level="2" size="medium">
            Hei!
          </Heading>
          <BodyLong size="large">
            Velkommen til forenklet pensjonskalkulator som kan gi deg et estimat
            på:
          </BodyLong>
          <List as="ul">
            <List.Item icon={<Icon color="var(--a-deepblue-500)" />}>
              alderspensjon (Nav)
            </List.Item>
            <List.Item icon={<Icon color="var(--a-purple-400)" />}>
              AFP i privat sektor (avtalefestet pensjon)
            </List.Item>
          </List>
          <BodyLong size="large">
            For å beregne pensjonen din, må du svare på alle spørsmålene som
            kommer
          </BodyLong>
          <BodyLong size="small">
            Du oppgir alle opplysninger selv. Vi ber ikke om personopplysninger
            som kan identifisere deg. Ingen opplysninger lagres.
          </BodyLong>
          <HStack gap={'2'}>
            <Link href="./kalkulator-uinnlogget/form" className="text-white">
              <Button variant="primary">Kom i gang</Button>
            </Link>
            <Button variant="tertiary">Avbryt</Button>
          </HStack>
        </VStack>
        <Substep>
          <BodyLong size="large">
            Kan du logge inn på Nav, anbefaler vi&nbsp;
            <Link href="https://www.nav.no/pensjon/kalkulator/login">
              innlogget kalkulator
            </Link>
          </BodyLong>
        </Substep>
      </Box>
    </Box>
  )
}
