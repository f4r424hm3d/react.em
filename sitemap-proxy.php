<?php
$map = [
  'sitemap.xml' => 'https://admin.educationmalaysia.in/sitemap.xml',
  'sitemap-home.xml' => 'https://admin.educationmalaysia.in/sitemap-home.xml',
  'sitemap-exams.xml' => 'https://admin.educationmalaysia.in/sitemap-exams.xml',
  'sitemap-services.xml' => 'https://admin.educationmalaysia.in/sitemap-services.xml',
  'sitemap-universities.xml' => 'https://admin.educationmalaysia.in/sitemap-universities.xml',
  'sitemap-university.xml' => 'https://admin.educationmalaysia.in/sitemap-university.xml',
  'sitemap-university-program.xml' => 'https://admin.educationmalaysia.in/sitemap-university-program.xml',
  'sitemap-specialization.xml' => 'https://admin.educationmalaysia.in/sitemap-specialization.xml',
  'sitemap-course.xml' => 'https://admin.educationmalaysia.in/sitemap-course.xml',
  'sitemap-blog.xml' => 'https://admin.educationmalaysia.in/sitemap-blog.xml',
  'sitemap-course-level.xml' => 'https://admin.educationmalaysia.in/sitemap-course-level.xml',
  'sitemap-courses-in-malaysia.xml' => 'https://admin.educationmalaysia.in/sitemap-courses-in-malaysia.xml',
];

$file = $_GET['file'] ?? '';
if (!isset($map[$file])) {
  http_response_code(404);
  exit('Not found');
}

$ch = curl_init($map[$file]);
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_TIMEOUT => 15,
  CURLOPT_SSL_VERIFYPEER => true,
  CURLOPT_HTTPHEADER => ['Accept: application/xml,text/xml,*/*'],
]);

$body = curl_exec($ch);
$code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($body === false || $code >= 400) {
  http_response_code(502);
  exit('Sitemap upstream error');
}

header('Content-Type: application/xml; charset=UTF-8');
echo $body;
