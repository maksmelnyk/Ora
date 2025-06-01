using System.Globalization;

namespace Learning.Shared;

public static class IsoLanguageValidator
{
    private static readonly HashSet<string> _validIso639_2Codes = new(StringComparer.OrdinalIgnoreCase);

    static IsoLanguageValidator()
    {
        foreach (var culture in CultureInfo.GetCultures(CultureTypes.AllCultures))
        {
            if (!string.IsNullOrEmpty(culture.ThreeLetterISOLanguageName))
            {
                _validIso639_2Codes.Add(culture.ThreeLetterISOLanguageName);
            }
        }
    }

    public static bool IsValidIso639_2(string isoCode)
    {
        if (string.IsNullOrWhiteSpace(isoCode) || isoCode.Length != 3)
        {
            return false;
        }
        return _validIso639_2Codes.Contains(isoCode);
    }
}