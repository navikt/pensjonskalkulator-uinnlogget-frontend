export const errors = {
  PKU222BeregningstjenesteFeiletException: 'Beregning',
  PKU225AvslagVilkarsprovingForLavtTidligUttakException:
    'Avslag på vilkårsprøving grunnet for lavt tidlig uttak.',
  PKU224AvslagVilkarsprovingForKortTrygdetidException:
    'Beregningen viser at du ikke kan ta ut pensjon fra tidspunktet du ønsker fordi du har for lav pensjonsopptjening. Du kan prøve igjen med en lavere uttaksgrad eller et senere tidspunkt for uttak av pensjon.',
  default: 'Det har oppstått en feil. Vennligst prøv igjen senere.',
}

export const getErrors = () => errors
