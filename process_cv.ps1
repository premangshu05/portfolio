$ErrorActionPreference = "Stop"
try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Open("C:\Users\prema\Downloads\Premangshu_CV_final.docx", $false, $true)
    
    $outPath = "c:\Users\prema\Desktop\portfolio\cv_extracted.txt"
    "---CONTENT START---" | Out-File -FilePath $outPath -Encoding utf8
    $doc.Content.Text | Out-File -FilePath $outPath -Encoding utf8 -Append
    "---CONTENT END---" | Out-File -FilePath $outPath -Encoding utf8 -Append
    
    "---LINKS START---" | Out-File -FilePath $outPath -Encoding utf8 -Append
    foreach ($link in $doc.Hyperlinks) {
        if ($link.Address) {
            "$($link.TextToDisplay) -> $($link.Address)" | Out-File -FilePath $outPath -Encoding utf8 -Append
        }
    }
    "---LINKS END---" | Out-File -FilePath $outPath -Encoding utf8 -Append
    
    $doc.Close([ref] 0)
    $word.Quit()
} catch {
    "Error: $_" | Out-File -FilePath "c:\Users\prema\Desktop\portfolio\cv_extracted.txt" -Encoding utf8
    if ($word -ne $null) {
        $word.Quit()
    }
}
