const error = {
  PKU222BeregningstjenesteFeiletException: 'Beregning',
  PKU225AvslagVilkarsprovingForLavtTidligUttakException:
    'Avslag på vilkårsprøving grunnet for lavt tidlig uttak.',
  PKU224AvslagVilkarsprovingForKortTrygdetidException:
    'Avslag på vilkårsprøving grunnet for kort trygdetid.',
  default: 'Det har oppstått en feil. Vennligst prøv igjen senere.',
}

export const getErrors = () => error
